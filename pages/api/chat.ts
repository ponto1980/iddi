import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.TOGETHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Together API key' });
  }

  try {
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-Coder-1.3B-Instruct",
        messages: [
          { role: "system", content: "Rispondi con empatia e chiarezza. Sii una guida riflessiva e stimolante." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ reply: `Errore Together.ai: ${JSON.stringify(data.error)}` });
    }

    const reply = data.choices?.[0]?.message?.content || "Nessuna risposta ricevuta.";
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Errore chiamata Together.ai:", error);
    res.status(500).json({ reply: "Errore nella comunicazione con Together.ai." });
  }
}
