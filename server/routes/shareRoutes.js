const express = require("express")
const getUserMiddleware = require("../middleware/authMiddleware")
const { shareTask, } = require("../controllers/shareController")
const router = express.Router();
router.get("/:task_id", getUserMiddleware, shareTask)
module.exports = router;
