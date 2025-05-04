export default async function handler(req, res) {
  const { topic } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Tulis artikel blog sekitar 500 kata tentang: ${topic}` }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  res.status(200).json({ article: data.choices[0].message.content });
}
