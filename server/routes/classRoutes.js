const express = require('express');
const router = express.Router();
const { createClass, getAllClasses, getClassById } = require('../controllers/classController');
const verifyToken = require('../middlewares/verifyToken');

// Admin create new class
router.post('/', verifyToken, createClass);

// Admin get all classes with pagination, search
router.get('/', getAllClasses);
router.get('/:id', getClassById);

module.exports = router;
