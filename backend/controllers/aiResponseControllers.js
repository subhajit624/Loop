import fetch from "node-fetch";

export const aiResponse = async (req, res) => {
  try {
    const { normal } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Convert this into a lovely comment for posting on social media: "${normal}"`
          }
        ]
      })
    });

    const data = await response.json();

    // GPT-3.5 returns text directly in choices[0].message.content
    const aiText = data?.choices?.[0]?.message?.content || "No response from AI";

    res.status(200).json({ comment: aiText });

  } catch (error) {
    console.error("Error in aiResponse controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
