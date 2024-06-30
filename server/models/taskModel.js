const mongoose = require("mongoose");
require('mongoose-type-email');
const Schema = mongoose.Schema;
const taskStepSchema = new mongoose.Schema({
    description: String,
    done: Boolean
});
const taskSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
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
        required: true
    },
    task_steps: [taskStepSchema],
    assigned_status: {
        type: String,
        enum: ["User", "Admin"],

    },
    assgned_to_id: {
        type: Schema.Types.ObjectId,
        ref: "userModel",
    },
    assgned_to_email: {
        type: mongoose.SchemaTypes.Email // email validation with the mongooseSchemaTypes.Email library
    },
    due_date: Date

}, {
    timestamps: true,
})
module.exports = mongoose.model("tasks", taskSchema);