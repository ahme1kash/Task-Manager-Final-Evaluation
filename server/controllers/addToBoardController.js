const addToBoardModel = require("../models/addToBoardModel");
const addToBoardController = async (req, res) => {
    try {
        const { email } = req.body;

        //?check user
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
module.exports = { addToBoardController }