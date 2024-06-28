const express = require("express");
const router = express.Router();
const updateUserController = require("../controllers/userController");
const getUserMiddleware = require("../middleware/authMiddleware");
router.put("/updateUser", getUserMiddleware, updateUserController)
module.exports = router