const Message = require("../models/Message");

// GET chat messages by conversationId
const getMessagesByConversationId = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId }).sort("timestamp");
    res.status(200).json(messages);
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
const createMessage = async (req, res) => {
    try {
      const { conversationId, senderEmail, receiverEmail, text } = req.body;
  
      if (!conversationId || !senderEmail || !receiverEmail || !text) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const newMessage = new Message({
        conversationId,
        senderEmail,
        receiverEmail,
        text,
      });
  
      const savedMessage = await newMessage.save();
      res.status(201).json(savedMessage);
    } catch (error) {
      console.error("Failed to save message:", error);
      res.status(500).json({ error: "Failed to save message" });
    }
  };
module.exports = {
  getMessagesByConversationId,
  createMessage
};
