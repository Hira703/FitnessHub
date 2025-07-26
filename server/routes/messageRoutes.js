const express = require("express");
const router = express.Router();
const {
  getMessagesByConversationId, createMessage,
} = require("../controllers/messageController");
const verifyToken = require("../middlewares/verifyToken");

router.get("/:conversationId",verifyToken, getMessagesByConversationId);
router.post("/",verifyToken, createMessage);

module.exports = router;
