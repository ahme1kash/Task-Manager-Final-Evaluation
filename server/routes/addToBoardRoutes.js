const express = require("express");
const router = express.Router();
const { addToBoardController } = require("../controllers/addToBoardController");
const getUserMiddleware = require("../middleware/authMiddleware");
router.post("/onboard", getUserMiddleware, addToBoardController)
module.exports = router