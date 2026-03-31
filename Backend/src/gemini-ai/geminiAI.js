import { GoogleGenAI } from "@google/genai";

export default async function getGeminiResponse(userMessage) {
  try {
    const aiKey = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `Act as a software engineering professor and answer whatever question from your student: ${userMessage}. Give also code snippets if needed.`;

    const response = await aiKey.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const reply =
      response?.text ||
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    return reply;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Service is unavilable right now";
  }
}
