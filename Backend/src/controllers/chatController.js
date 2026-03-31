import getGeminiResponse from "../gemini-ai/geminiAI.js";
import {
  buildFrequencyMap,
  buildHuffmanTree,
  generateCodes,
  encode,
  decode,
  calculateCompression,
} from "../huffman__algorithm/huffman.js";

function serializeTree(node) {
  if (!node) return null;
  return {
    char: node.char,
    freq: node.freq,
    left: serializeTree(node.left),
    right: serializeTree(node.right),
  };
}

const chatController = async (req, res) => {
  try {
    const { userPrompt } = req.body;

    if (!userPrompt) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message",
      });
    }

    const aiReply = await getGeminiResponse(userPrompt);

    const userFreq = buildFrequencyMap(userPrompt);
    const userTree = buildHuffmanTree(userFreq);
    const userCodes = generateCodes(userTree);
    const userEncoded = encode(userPrompt, userCodes);
    const userDecoded = decode(userEncoded, userTree);
    const userCompression = calculateCompression(userPrompt, userEncoded);

    const botFreq = buildFrequencyMap(aiReply);
    const botTree = buildHuffmanTree(botFreq);
    const botCodes = generateCodes(botTree);
    const botEncoded = encode(aiReply, botCodes);
    const botCompression = calculateCompression(aiReply, botEncoded);

    return res.json({
      success: true,
      user: {
        original: userPrompt,
        encoded: userEncoded,
        decoded: userDecoded,
        compression: userCompression,
        tree: serializeTree(userTree), 
        codes: userCodes,
      },
      bot: {
        original: aiReply,
        encoded: botEncoded,
        compression: botCompression,
        tree: serializeTree(botTree), 
        codes: botCodes, 
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Chat failed",
      error: error.message,
    });
  }
};

export default chatController;
