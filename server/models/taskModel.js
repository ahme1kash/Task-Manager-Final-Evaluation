const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const taskStepSchema = new mongoose.Schema({
    description: String,
    done: {
        type: "Boolean",
        default: false,
    },
    count_tasks: {
        type: "Number"
    },
    total_tasks: {
        type: "Number"
    }

});
const taskSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    assignor_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    // user_email: {
    //     type: String,
    //     required: [true, "email is Required"],
    //     unique: true,
    //     min: 14,
    //     validate: {
    //         validator: validator.isEmail,
    //         message: "Please provide a valid email",
    //     },
    // },
    task_title: {
        type: String,
        required: true
    },
    task_priority: {
        type: String,
        enum: ["HIGH PRIORITY", "LOW PRIORITY", "MODERATE PRIORITY"],
        required: true
    },
    task_status: {
        type: String,
        default: "To do",
        enum: ["To do", "Backlog", "Done", "In Progress"],
    },
    task_steps: [taskStepSchema],
    assigned_to_email: {
        type: String,
        min: 14,
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email",
        },

    },
    due_date: Date

}, {
    timestamps: true,
})
module.exports = mongoose.model("tasks", taskSchema);