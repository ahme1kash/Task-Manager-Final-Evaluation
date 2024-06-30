const express = require("express");
const {
    readCountController,
} = require("../controllers/countController");
const getUserMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
router.get("/readCount", getUserMiddleware, readCountController);
module.exports = router;