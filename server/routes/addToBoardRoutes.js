const express = require("express");
const router = express.Router();
const { addToBoardUserController, getAllUserFromBoardController } = require("../controllers/addToBoardController");
const getUserMiddleware = require("../middleware/authMiddleware");
router.post("/addUser", getUserMiddleware, addToBoardUserController)
router.get("/getAll", getUserMiddleware, getAllUserFromBoardController)
module.exports = router