const express = require("express")
const getUserMiddleware = require("../middleware/authMiddleware")
const { shareTask, publicShareTask } = require("../controllers/shareController")
const router = express.Router();
router.get("/public/:task_id", publicShareTask)
router.get("/:task_id", getUserMiddleware, shareTask)
module.exports = router;
