const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
  title: String,
  content: String,
  votes: {
    up: { type: Number, default: 0 },
    down: { type: Number, default: 0 }
  },
  votedBy: [
    {
      userEmail: String,
      voteType: { type: String, enum: ['upvote', 'downvote'] }
    }
  ],
  author: {
    userId: String,
    name: String,
    role: { type: String, enum: ['admin', 'trainer'] },
    image: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Forum', forumSchema);
