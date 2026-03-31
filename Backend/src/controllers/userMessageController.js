const userMessage = (req, res) => {
  const { userPrompt } = req.body;

  if (!userPrompt) {
    return res.status(400).json({
      success: false,
      message: "Ask questions to AI",
    });
  }

  res.json({
    success: true,
    message: "Message received into the backend",
  });
};

export default userMessage;
