const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  const { topic } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: `Tulis artikel 500 kata tentang: ${topic}` }
      ],
    });

    const article = completion.data.choices[0].message.content;
    res.status(200).json({ article });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
