const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  // CORS agar bisa diakses dari frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end(); // Preflight CORS

  // ✅ Manual parsing body JSON
  let body = '';
  for await (const chunk of req) body += chunk;

  let topic;
  try {
    const data = JSON.parse(body);
    topic = data.topic;
  } catch (e) {
    return res.status(400).json({ error: "Body tidak valid atau kosong." });
  }

  if (!topic) {
    return res.status(400).json({ error: "Topik tidak boleh kosong." });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: `Tulis artikel 500 kata tentang: ${topic}` },
      ],
    });

    const article = completion.data.choices[0].message.content;
    res.status(200).json({ article });
  } catch (error) {
    res.status(500).json({ error: error.message || "Gagal memanggil OpenAI." });
  }
};
