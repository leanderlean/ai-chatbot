import getGeminiResponse from "../gemini-ai/geminiAI.js";

const aiResponse = async (req, res) => {
  try {
    const { userPrompt } = req.body;

    if (!userPrompt) {
      return res.status(400).json({
        success: false,
        message: "Please input your prompt",
      });
    }

    // const reply = await getGeminiResponse(userPrompt);
    res.json({
      success: true,
      message:
        "A REST API is a system that allows a frontend and backend to communicate using HTTP methods like GET, POST, PUT, and DELETE. It follows a structured URL design, sends data in JSON format, and is stateless, meaning each request contains all necessary information without relying on stored session data.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "AI request failed",
      error: error.mesage,
    });
  }
};

export default aiResponse;
