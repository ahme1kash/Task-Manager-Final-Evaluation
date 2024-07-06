const mongoose = require("mongoose");
const taskModel = require("../models/taskModel");
const readCountController = async (req, res) => {
    try {
        const user_id = req.body.id;
        // console.log(user_id);
        const tasks = await taskModel.find({ user_id: user_id });
        // console.log(tasks)

        let to_do_count = 0,
            in_progress_count = 0,
            done_count = 0,
            backlog_count = 0,
            high_priority_count = 0,
            low_priority_count = 0,
            moderate_prority_count = 0,
            due_date_count = 0;

        for (let task of tasks) {
            if (task.task_status === "To do") {
                to_do_count += 1;
            }
            if (task.task_status === "In Progress") {
                in_progress_count += 1;
            }
            if (task.task_status === "Done") {
                done_count += 1;
            }
            if (task.task_status === "Backlog") {
                backlog_count += 1;
            }
            if (task.task_priority === "HIGH PRIORITY") {
                high_priority_count += 1;
            }
            if (task.task_priority === "MODERATE PRIORITY") {
                moderate_prority_count += 1;
            }
            if (task.task_status === "LOW PRIORITY") {
                low_priority_count += 1;
            }
            if (task.due_date) {
                let due_date = new Date(task.due_date);
                let current_date = new Date();
                // console.log("current_date", current_date)
                if (due_date >= current_date) {
                    // console.log("Due Date for task with id", task._id);
                    due_date_count += 1;
                }
            }
        }
        if (!tasks) {
            return res.status(404).send({
                success: false,
                message: "No Tasks found",
            });
        }
        const counts = {
            to_do_count,
            in_progress_count,
            done_count,
            backlog_count,
            high_priority_count,
            low_priority_count,
            moderate_prority_count,
            due_date_count,
        };
        return res.status(200).send({
            success: true,
            message: "Tasks Retrieved Successfully",
            counts,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error, Error in readTaskController API",
        });
    }
};
module.exports = { readCountController };
