const express = require("express");
const router = express.Router();
const {
  getMessagesByConversationId, createMessage,
} = require("../controllers/messageController");

router.get("/:conversationId", getMessagesByConversationId);
router.post("/", createMessage);

module.exports = router;
