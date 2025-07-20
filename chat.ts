import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { message, history, prompt } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing Claude API key" });
  }

  try {
    const formattedHistory = history.map((msg: any) =>
      msg.sender === "user"
        ? `

Human: ${msg.text}`
        : `

Assistant: ${msg.text}`
    ).join("");

    const systemPrompt = prompt || "Sei un assistente brillante, empatico e ragioni in italiano. Rispondi con logica, coerenza e comprensione del contesto.";

    const body = {
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 0.9,
      system: systemPrompt,
      prompt: `${formattedHistory}

Human: ${message}

Assistant:`,
      stream: false
    };

    const response = await fetch("https://api.anthropic.com/v1/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ reply: `Errore Claude: ${JSON.stringify(data.error)}` });
    }

    const reply = data.completion?.trim() || "Nessuna risposta ricevuta.";
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Errore Claude API:", error);
    res.status(500).json({ reply: "Errore nella comunicazione con Claude." });
  }
}
