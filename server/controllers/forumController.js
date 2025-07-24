const Forum = require('../models/Forum');

exports.getForums = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
  
    const forums = await Forum.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  
    const total = await Forum.countDocuments();
    const pages = Math.ceil(total / limit);
  
    res.json({
      forums,
      pagination: {
        page,
        pages,
      },
    });
  };
  

  exports.addForum = async (req, res) => {
    try {
      const { title, content,author } = req.body;
    //   const user = req.user;
  
   
      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required." });
      }
  
     
    //   if (!["admin", "trainer"].includes(user.role)) {
    //     return res.status(403).json({ message: "Access denied. Only admins and trainers can post forums." });
    //   }
  
     
      const newPost = new Forum({
        title,
        content,
        author
      });
  
      await newPost.save();
  
      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error adding forum:", error);
      res.status(500).json({ message: "Failed to create forum post." });
    }
  };
  

  exports.voteForum = async (req, res) => {
    try {
      const { voteType } = req.body; // 'upvote' or 'downvote'
      const forumId = req.params.id;
      const user = req.user;
  
      if (!["upvote", "downvote"].includes(voteType)) {
        return res.status(400).json({ message: "Invalid vote type" });
      }
  
      const forum = await Forum.findById(forumId);
      if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
      }
  
      // Prevent double voting
      const alreadyVoted = forum.votedBy.find(
        (v) => v.userEmail === user.email.toString()
      );
  
      if (alreadyVoted) {
        return res.status(400).json({ message: "You have already voted on this post" });
      }
  
      // Update vote count
      if (voteType === "upvote") {
        forum.votes.up += 1;
      } else {
        forum.votes.down += 1;
      }
  
      // Record voter
      forum.votedBy.push({
        userEmail: user.email.toString(),
        voteType,
      });
  
      await forum.save();
  
      res.json({
        message: "Vote recorded",
        upvotes: forum.votes.up,
        downvotes: forum.votes.down,
      });
    } catch (err) {
      console.error("Vote error:", err);
      res.status(500).json({ message: "Server error during voting" });
    }
  };
  
