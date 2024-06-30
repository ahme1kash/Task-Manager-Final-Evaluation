const express = require("express");
const {
    createTaskController,
    updateTaskStatusController,
    updateTaskController,
    readTaskController,
    deleteTaskController
} = require("../controllers/taskController");
const getUserMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
//routes
//Register || POSt
router.post("/createTask", getUserMiddleware, createTaskController);
router.put("/updateTask/:task_id", getUserMiddleware, updateTaskController);
router.get("/readTask/:task_id", getUserMiddleware, readTaskController);
router.delete("/deleteTask/:task_id", getUserMiddleware, deleteTaskController);
router.put("/updateTaskStatus/:task_id", getUserMiddleware, updateTaskStatusController);
module.exports = router;
