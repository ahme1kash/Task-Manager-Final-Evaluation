const mongoose = require("mongoose");
const validator = require("validator");

const addUserSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, "email is Required"],
        min: 14,
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email",
        },
    },

},
    { timestamps: true }
);

module.exports = mongoose.model("addUser", addUserSchema); //*.model("collection name", schemaName);
