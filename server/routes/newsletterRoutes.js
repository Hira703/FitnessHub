const express = require('express');
const router = express.Router();
const { subscribeUser, getAllSubscribers, deleteSubscriber } = require('../controllers/newsletterController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/subscribe', subscribeUser);
router.get('/subscribers', verifyToken, getAllSubscribers);
router.delete('/subscribers/:id', verifyToken, deleteSubscriber);


module.exports = router;
