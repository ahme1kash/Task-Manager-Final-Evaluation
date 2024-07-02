const addToBoardModel = require("../models/addToBoardModel");
const addToBoardUserController = async (req, res) => {
    try {
        const { email } = req.body;

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
        console.log("Hello")
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