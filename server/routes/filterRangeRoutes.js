const express = require("express");
const {
    filterController,
} = require("../controllers/filterRangeController");
const getUserMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
router.get("/", getUserMiddleware, filterController);
module.exports = router;