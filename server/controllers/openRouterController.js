const { OpenRouter } = require("@openrouter/sdk");

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

exports.chatWithDeepSeek = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const response = await openrouter.chat.send({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content: "You are a helpful Sri Lanka travel assistant."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply =
      response.choices?.[0]?.message?.content ||
      "No response from Chatbot";

    res.json({ reply });

  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({
      reply: "AI service unavailable"
    });
  }
};
