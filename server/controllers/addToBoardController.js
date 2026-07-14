const addToBoardModel = require("../models/addToBoardModel");
const userModel = require("../models/userModel");
const addToBoardUserController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).send({
                success: false,
                message: "Email is required",
            });
        }

        const registeredUser = await userModel.findOne({ email });
        if (!registeredUser) {
            return res.status(400).send({
                success: false,
                message: "Person must be a registered Pro Manage user",
            });
        }

        //check user
        const existing = await addToBoardModel.findOne({ email });
        if (existing) {
            return res.status(500).send({
                success: false,
                message: "Person is Already Onboarded",
            });
        }
        const onboarded_user = await addToBoardModel.create({
            email

        });
        return res.status(201).send({
            success: true,
            message: "New User Registered Successfully",
            onboarded_user,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in addToBoardController",
            err,
        });
    }
};



const getAllUserFromBoardController = async (req, res) => {
    try {

        //get user
        const getAllUsers = await addToBoardModel.find();
        return res.status(201).send({
            success: true,
            message: "All Users from Board fetched Successfully",
            getAllUsers,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in addToBoardController",
            err,
        });
    }
};
module.exports = { addToBoardUserController, getAllUserFromBoardController }
