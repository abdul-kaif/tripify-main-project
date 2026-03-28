import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const askAi = async (req, res) => {
  try {
    const { question } = req.body;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are Tripify AI, a travel assistant helping users plan trips.",
        },
        {
          role: "user",
          content: question,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    const reply = chatCompletion.choices[0]?.message?.content;

    res.json({
      success: true,
      response: reply,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "AI error",
    });
  }
};