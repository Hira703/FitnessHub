const express = require('express');
const router = express.Router();
const {
  getForums,
  addForum,
  voteForum
} = require('../controllers/forumController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', getForums); // Public
router.post('/', verifyToken, addForum); // Admin/Trainer only
router.patch('/:id/vote', verifyToken, voteForum); // Authenticated users

module.exports = router;
