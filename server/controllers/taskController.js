// Get USER Info
const mongoose = require("mongoose")
const taskModel = require("../models/taskModel");
const userModel = require("../models/userModel");

const hasInvalidTaskSteps = (task_steps) => {
    return !Array.isArray(task_steps) || task_steps.length === 0 || task_steps.some((step) => !step.description || !step.description.trim());
};

const canAccessTask = (task, user_id, user_email) => {
    return task.assignor_id.toString() === user_id || task.assigned_to_email === user_email;
};

const isTaskAssignor = (task, user_id) => {
    return task.assignor_id.toString() === user_id;
};

const getUserTaskQuery = (user_id, user_email) => ({
    $or: [{ "assignor_id": user_id }, { "assigned_to_email": { $eq: user_email } }],
});

const createTaskController = async (req, res) => {
    try {
        const user_id = req.user.id;
        const assignor_id = req.user.id;  //By default assignor_id set to user_id 
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

        const assignedUser = await userModel.findOne({ email: assigned_to_email });
        if (!assignedUser) {
            return res.status(400).send({
                success: false,
                message: "Assigned user must be a registered Pro Manage user"
            })
        }

        const {
            task_title,
            task_priority,
            task_steps,
            due_date,


        } = req.body;
        // Must to add fields
        if (!user_id || !task_title || !task_priority || hasInvalidTaskSteps(task_steps)) {
            return res.status(400).send({
                success: false,
                message: "Task title, priority and non-empty checklist items are required"
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
        const user_id = req.user.id;
        const task_status = req.body.task_status;
        const user = await userModel.findById(user_id);
        const task = await taskModel.findById(task_id);

        if (!task) {
            return res.status(404).send({
                success: false,
                message: "Task Not Found"
            })
        }

        if (!canAccessTask(task, user_id, user.email)) {
            return res.status(403).send({
                success: false,
                message: "You are not authorized to update this task"
            })
        }

        const updated_task = await taskModel.findByIdAndUpdate(task_id, { task_status }, { new: true, runValidators: true })

        return res.status(201).send({
            success: true,
            message: "Task Status Updated Successfully",
            updated_task
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

const moveTaskController = async (req, res) => {
    try {
        const task_id = req.params.task_id;
        const user_id = req.user.id;
        const { task_status, task_order = 0 } = req.body;
        const user = await userModel.findById(user_id);
        const task = await taskModel.findById(task_id);

        if (!task) {
            return res.status(404).send({
                success: false,
                message: "Task Not Found"
            })
        }

        if (!canAccessTask(task, user_id, user.email)) {
            return res.status(403).send({
                success: false,
                message: "You are not authorized to move this task"
            })
        }

        const allowedStatuses = ["To do", "Backlog", "Done", "In Progress"];
        if (!allowedStatuses.includes(task_status)) {
            return res.status(400).send({
                success: false,
                message: "Invalid task status"
            })
        }

        const targetOrder = Math.max(0, Number(task_order) || 0);
        const visibleTasksInColumn = await taskModel
            .find({
                ...getUserTaskQuery(user_id, user.email),
                task_status,
                _id: { $ne: task_id },
            })
            .sort({ task_order: 1, createdAt: 1 });

        const orderedTasks = [...visibleTasksInColumn];
        orderedTasks.splice(Math.min(targetOrder, orderedTasks.length), 0, task);

        await Promise.all(
            orderedTasks.map((orderedTask, index) =>
                taskModel.findByIdAndUpdate(
                    orderedTask._id,
                    {
                        task_status,
                        task_order: index,
                    },
                    { runValidators: true }
                )
            )
        );

        const updated_task = await taskModel.findById(task_id);
        return res.status(200).send({
            success: true,
            message: "Task moved successfully",
            updated_task,
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            message: err.message || "Internal Server Error, Error in moveTaskController API"
        })
    }
};

const updateTaskController = async (req, res) => {
    try {
        const user_id = req.user.id;
        const task_id = req.params.task_id
        const user = await userModel.findById(user_id)
        // Assigning the email to user_email who is updating the task.
        const user_email = user.email
        const original_task = await taskModel.findById(task_id)

        if (!original_task) {
            return res.status(404).send({
                success: false,
                message: "Task Not Found"
            })
        }

        if (!isTaskAssignor(original_task, user_id)) {
            return res.status(403).send({
                success: false,
                message: "Only task assignor can edit this task"
            })
        }

        const assigned_to_email = req.body.assigned_to_email ? req.body.assigned_to_email : original_task.assigned_to_email
        const assignedUser = await userModel.findOne({ email: assigned_to_email });
        if (!assignedUser) {
            return res.status(400).send({
                success: false,
                message: "Assigned user must be a registered Pro Manage user"
            })
        }
        const new_task = {
            user_id: original_task.user_id,
            task_title: req.body.task_title,
            task_priority: req.body.task_priority,
            task_steps: req.body.task_steps,
            assigned_to_email,
            due_date: req.body.due_date && req.body.due_date
        }
        if (!new_task.task_title || !new_task.task_priority || hasInvalidTaskSteps(new_task.task_steps)) {
            return res.status(400).send({
                success: false,
                message: "Task title, priority and non-empty checklist items are required"
            })
        }
        const updated_task = { ...original_task._doc, ...new_task }
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

        const user_id = req.user.id
        const user = await userModel.findById(user_id)
        const user_email = user.email
        // Finds all tasks which are assigned to a person and tasks of his own too.
        // assignor_id will be same as user_id and once created and remains constant.
        const tasks = await taskModel.find(getUserTaskQuery(user_id, user_email)).sort({ task_status: 1, task_order: 1, createdAt: 1 })
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
        const user_id = req.user.id;
        if (!task) {
            return res.status(404).send({
                success: false,
                message: "Task Not Found"
            })
        }

        if (!isTaskAssignor(task, user_id)) {
            return res.status(403).send({
                success: false,
                message: "Only task assignor can delete this task"
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
    moveTaskController,
    updateTaskController,
    readTaskController,
    deleteTaskController,
};
