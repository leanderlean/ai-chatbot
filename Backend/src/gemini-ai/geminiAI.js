import { GoogleGenAI } from "@google/genai";

function cleanMarkdown(text) {
  if (!text) return text;

  // Remove markdown bold (**)
  text = text.replace(/\*\*(.*?)\*\*/g, "$1");

  // Remove markdown italic (*)
  text = text.replace(/\*(.*?)\*/g, "$1");

  // Remove markdown headers (#, ##, ###, etc.)
  text = text.replace(/^#+\s+/gm, "");

  // Convert markdown links [text](url) to just text
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, "$1");

  // Remove markdown inline code backticks but keep the content
  text = text.replace(/`(.*?)`/g, "$1");

  // Convert markdown code blocks to plain text with newlines
  text = text.replace(/```[\s\S]*?```/g, (match) => {
    // Keep code content but remove the fence markers
    return match.replace(/```/g, "").trim();
  });

  // Convert markdown lists (*-, +) to simple text
  text = text.replace(/^\s*[-*+]\s+/gm, "• ");

  // Remove extra blank lines (more than 2)
  text = text.replace(/\n\n\n+/g, "\n\n");

  return text.trim();
}

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

    let reply =
      response?.text ||
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    // Clean markdown formatting
    reply = cleanMarkdown(reply);

    return reply;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "service unavailable right now";
  }
}
