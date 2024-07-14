const express = require("express");
const router = express.Router();
const { getUserController, updateUserController } = require("../controllers/userController");
const getUserMiddleware = require("../middleware/authMiddleware");
router.put("/updateUser", getUserMiddleware, updateUserController)
router.get("/getUser", getUserMiddleware, getUserController)
module.exports = router