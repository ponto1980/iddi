import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }

  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Rispondi con empatia e chiarezza. Sii una guida riflessiva e non sbrigativa." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await completion.json();
    const response = data.choices?.[0]?.message?.content || "Nessuna risposta ricevuta.";

    res.status(200).json({ reply: response });
  } catch (error) {
    res.status(500).json({ error: "Errore nella comunicazione con OpenAI." });
  }
}
