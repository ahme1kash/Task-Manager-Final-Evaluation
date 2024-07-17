// Get USER Info
const mongoose = require("mongoose")
const taskModel = require("../models/taskModel");
const userModel = require("../models/userModel");
const createTaskController = async (req, res) => {
    try {
        const user_id = req.body.id;
        const assignor_id = req.body.id;  //By default assignor_id set to user_id 
        let assigned_to_email;
        // finding user_email below
        const user = await userModel.findById(user_id)
        // Assigning the email to user_email who is creating the task.
        const user_email = user.email
        // const assignor = user.email
        // By default assigning task to creator of task if he does not assigns the task to someone.
        assigned_to_email = req.body.assigned_to_email
        console.log("Assigned_to_email", assigned_to_email)
        if (assigned_to_email == undefined) {
            assigned_to_email = user.email
        }
        else {
            assigned_to_email = req.body.assigned_to_email
        }

        const {
            task_title,
            task_priority,
            task_steps,
            due_date,


        } = req.body;
        // Must to add fields
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
            user_email,
            task_steps,
            assigned_to_email,
            due_date,
            assignor_id
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
        const user_id = req.body.id;
        const task_id = req.params.task_id
        const user = await userModel.findById(user_id)
        // Assigning the email to user_email who is updating the task.
        const user_email = user.email
        const original_task = await taskModel.findById(task_id)
        const assigned_to_email = req.body.assigned_to_email ? req.body.assigned_to_email : original_task.assigned_to_email
        const assignor_id = original_task.assignor_id.toString();// will be constant and will point to creator of task
        // console.log(assignor_id, user_id, user_email, assigned_to_email)
        const new_task = {
            user_id: req.body.id,
            task_title: req.body.task_title,
            task_priority: req.body.task_priority,
            task_steps: req.body.task_steps,
            assigned_to_email,
            due_date: req.body.due_date && req.body.due_date
        }
        // Say if B got assigned from A and if B tries to reassign the task which was assigned to him, then
        // below line will give error
        if (assignor_id !== user_id && user_email !== assigned_to_email) {
            return res.status(404).send({
                success: "false",
                message: "Cannot Re-assign the assigned task. Update operation failed"
            })
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

        const user_id = req.body.id
        const user = await userModel.findById(user_id)
        const user_email = user.email
        // Finds all tasks which are assigned to a person and tasks of his own too.
        // assignor_id will be same as user_id and once created and remains constant.
        const tasks = await taskModel.find({ $or: [{ "assignor_id": user_id }, { "assigned_to_email": { $eq: user_email } }], })
        console.log("Tasks", tasks)
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
        console.log(err)
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
