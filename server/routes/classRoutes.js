const express = require('express');
const router = express.Router();
const { createClass, getAllClasses, getClassById, deleteClass } = require('../controllers/classController');
const verifyToken = require('../middlewares/verifyToken');

// Admin create new class
router.post('/', verifyToken, createClass);

// Admin get all classes with pagination, search
router.get('/', getAllClasses);
router.get('/:id', getClassById);
router.delete('/:id', verifyToken, deleteClass);

module.exports = router;
