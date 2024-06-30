// Get USER Info
const mongoose = require("mongoose")
const taskModel = require("../models/taskModel");
const createTaskController = async (req, res) => {
    try {
        const user_id = req.body.id
        const {
            task_title,
            task_priority,
            task_steps,
            assigned_status,
            assigned_to_id,
            assigned_to_email,
            due_date,
        } = req.body;
        console.log(req.body)
        if (!user_id || !task_title || !task_priority || !task_steps) {
            return res.status(400).send({
                success: false,
                message: "Some Task Fields are missing. Failed to Add new Task"
            })
        }

        const task = await taskModel.create({
            user_id,
            task_title,
            task_priority,
            task_steps,
            assigned_status,
            assigned_to_id,
            assigned_to_email,
            due_date,
        });
        return res.status(201).send({
            success: true,
            message: "New Task Added Successfully",
            task
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Internal Server Error,Error in Create TaskController API"
        })
    }
};

const updateTaskStatusController = async (req, res) => {
    try {
        const task_id = req.params.task_id
        console.log(task_id)
        const task_status = req.body.task_status;
        console.log(task_status)
        await taskModel.findByIdAndUpdate(task_id, { task_status }, { new: true, runValidators: true })
        const only_updated_task_status = await taskModel.findByIdAndUpdate(task_id)
        console.log(only_updated_task_status)

        return res.status(201).send({
            success: true,
            message: "Task Status Updated Successfully",
            only_updated_task_status
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Internal Server Error"
        })
    }
};
const updateTaskController = async (req, res) => {
    try {
        const task_id = req.params.task_id
        const original_task = await taskModel.findById(task_id)
        console.log("original_task", original_task)
        // console.log(req.body.id, req.body.task_title, req.body.due_date, req.body.task_priority, req.body.task_steps, req.body.assigned_status, req.body.assigned_to_id, req.body.assigned_to_email)
        const new_task = {
            user_id: req.body.id,
            task_title: req.body.task_title,
            task_priority: req.body.task_priority,
            task_steps: req.body.task_steps,
            // Optional fields
            assigned_status: req.body.assigned_status && req.body.assigned_status,
            assigned_to_id: req.body.assigned_to_id && req.body.assigned_to_id,
            assigned_to_email: req.body.assigned_to_email && req.body.assigned_to_email,
            due_date: req.body.due_date && req.body.due_date
        }
        console.log("New_Tasks", new_task)
        const updated_task = { ...original_task._doc, ...new_task }
        console.log("Updated Tasks", updated_task)
        await taskModel.findByIdAndUpdate(req.params.task_id, new_task, { new: true, runValidators: true }) // Enforcing Mongoose schema to check the value
        return res.status(201).send({
            success: true,
            message: "Task Updated successfully",
            updated_task
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            message: "Internal Server Error, Error in updateTaskController API"
        })
    }
};
const readTaskController = async (req, res) => {
    try {
        // Matching both the task_id and user_id , however only task_id can do the work
        const task_id = req.params.task_id
        const user_id = req.body.id
        const tasks = await taskModel.find({ _id: task_id, user_id: user_id })
        if (!tasks) {
            return res.status(404).send({
                success: false,
                message: "No Tasks found"
            })

        }
        return res.status(200).send({
            success: true,
            message: "Tasks Retrieved Successfully",
            tasks
        })
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error, Error in readTaskController API"
        })
    }
};
const deleteTaskController = async (req, res) => {
    try {
        const task = await taskModel.findById(req.params.task_id)
        if (!task) {
            return res.status(404).send({
                success: false,
                message: "Task Not Found"
            })
        }
        await taskModel.findByIdAndDelete(req.params.task_id)
        return res.status(200).send({
            success: true,
            message: "Task Deleted Successfully",
            deleted_task: task
        })
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error, Error in deleteTaskController API"
        })
    }
};

module.exports = {
    createTaskController,
    updateTaskStatusController,
    updateTaskController,
    readTaskController,
    deleteTaskController,
};
