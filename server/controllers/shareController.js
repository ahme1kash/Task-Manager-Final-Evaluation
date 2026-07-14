const mongoose = require("mongoose");
const taskModel = require("../models/taskModel");
const userModel = require("../models/userModel");
// All Queries match filter criteria as per MONGO server Time which trails by GMT- 5:30 as per Indian Standard Time (IST)
const shareTask = async (req, res) => {
    try {
        const user_id = req.user.id
        const task_id = req.params.task_id
        const user = await userModel.findById(user_id)
        const task = await taskModel.findOne({
            _id: task_id,
            $or: [{ "assignor_id": user_id }, { "assigned_to_email": { $eq: user.email } }]
        })

        if (!task) {
            return res.status(404).send({
                success: false,
                message: "No Tasks found"
            })

        }
        return res.status(200).send({
            success: true,
            message: "Tasks Retrieved Successfully",
            task
        })
    }
    catch (err) {
        console.log(err)
    }
}

const publicShareTask = async (req, res) => {
    try {
        const task_id = req.params.task_id
        const task = await taskModel.findById(task_id)

        if (!task) {
            return res.status(404).send({
                success: false,
                message: "No Task found"
            })
        }

        return res.status(200).send({
            success: true,
            message: "Task Retrieved Successfully",
            task
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = { shareTask, publicShareTask }
