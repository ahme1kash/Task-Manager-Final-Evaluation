const mongoose = require("mongoose");
const taskModel = require("../models/taskModel");
// All Queries match filter criteria as per MONGO server Time which trails by GMT- 5:30 as per Indian Standard Time (IST)
const shareTask = async (req, res) => {
    try {
        const user_id = req.body.id
        const task_id = req.params.task_id
        // Matcing both task_id and user_id , however only task_id can do the work
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
    }
    catch (err) {
        console.log(err)
    }
}
module.exports = { shareTask }