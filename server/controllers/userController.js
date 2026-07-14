const userModel = require("../models/userModel");
const taskModel = require("../models/taskModel");
const addToBoardModel = require("../models/addToBoardModel");
const bcryptjs = require("bcryptjs");
const authService = require("../services/authService");

const updateUserController = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User Not Found",
            });
        }

        const { name, email, old_password, new_password } = req.body;
        const updates = {};

        if (name !== undefined && name.trim()) {
            updates.name = name.trim();
        }

        if (email !== undefined && email.trim() && email.trim() !== user.email) {
            const normalizedEmail = email.trim();
            const existingUser = await userModel.findOne({ email: normalizedEmail, _id: { $ne: userId } });

            if (existingUser) {
                return res.status(409).send({
                    success: false,
                    message: "Email is Already Registered",
                });
            }

            updates.email = normalizedEmail;
        }

        if (new_password !== undefined && new_password) {
            if (!old_password) {
                return res.status(400).send({
                    success: false,
                    message: "Please provide old password to confirm. Profile failed to update",
                });
            }

            const passwordMatches = await bcryptjs.compare(old_password, user.password);
            if (!passwordMatches) {
                return res.status(400).send({
                    success: false,
                    message: "Old password does not match with stored password",
                });
            }

            if (old_password === new_password) {
                return res.status(400).send({
                    success: false,
                    message: "New password is same as old password",
                });
            }

            if (new_password.length < 8) {
                return res.status(400).send({
                    success: false,
                    message: "New password should be at least 8 characters long",
                });
            }

            const salt = bcryptjs.genSaltSync(10);
            updates.password = await bcryptjs.hash(new_password, salt);
        }

        if (!Object.keys(updates).length) {
            return res.status(200).send({
                success: true,
                message: "No profile changes provided",
                user: { name: user.name, email: user.email },
            });
        }

        const oldEmail = user.email;
        const updatedUser = await userModel.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true,
        }).select("name email");

        if (updates.email) {
            await taskModel.updateMany({ assigned_to_email: oldEmail }, { assigned_to_email: updates.email });
            await addToBoardModel.updateMany({ email: oldEmail }, { email: updates.email });
        }

        if (updates.password) {
            return authService.logoutUserAfterPasswordChange(req, res);
        }

        return res.status(200).send({
            success: true,
            message: "User profile updated successfully",
            user: updatedUser,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Error in Update User Api",
        });
    }
};

module.exports = updateUserController;
