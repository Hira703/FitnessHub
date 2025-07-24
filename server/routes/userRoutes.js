const express = require("express");
const { saveUser, getUserByEmail, updateUser,getAdminOverview, getMemberStatsByEmail } = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/", saveUser);
router.get('/overview', verifyToken, getAdminOverview);
router.get('/stats/:email', getMemberStatsByEmail);
router.get('/stats/:email', getMemberStatsByEmail);
router.get('/:email', getUserByEmail);

router.put("/:email",verifyToken, updateUser);


module.exports = router;
