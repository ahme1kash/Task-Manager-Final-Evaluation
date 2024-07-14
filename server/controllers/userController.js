// Get USER Info
const userModel = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const authService = require("../services/authService")
const getUserController = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.id);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User Not Found",
            })
        }
        return res.status(200).send({
            success: true,
            message: "User Found",
            name: user.name

        })
    }
    catch (e) {
        console.log("Internal Server Error", e)
        res.status(500).send({
            success: false,
            message: "Internal Server Error, Error in API getUserControler"
        })

    }
}
const updateUserController = async (req, res) => {
    try {

        const user = await userModel.findById(req.body.id);
        console.log("14", user)

        // validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User Not Found",
            });
        }
        // const user_details = {
        //     name: user.name,
        //     password: user.password
        // }
        const editedUser = {
            name: req.body.name,
            old_password: req.body.old_password,
            new_password: req.body.new_password
        };
        console.log(editedUser)
        if (!editedUser.old_password && !editedUser.new_password && !editedUser.name) {
            console.log("Line 36")
            res.status(201).send({
                success: true,
                message: "All user fields are empty.No changes",
                editedUser,
            });
        }
        else if (!editedUser.old_password && !editedUser.new_password && editedUser.name !== undefined) {
            console.log("Line 44")
            const updatedUserFields = { ...user._doc, ...editedUser };
            await userModel.findByIdAndUpdate(
                req.body.id,
                updatedUserFields,
                { new: true } // This is important to add.
            );
            return res.status(201).send({
                success: true,
                message: "User Name Updated Successfully",
                editedUser,
            });
        }
        else if ((editedUser.old_password !== undefined) && (editedUser.new_password === undefined)) {
            const updatedUserFields = { ...user._doc, ...editedUser };
            await userModel.findByIdAndUpdate(
                req.body.id,
                updatedUserFields,
                { new: true } // This is important to add.
            );
            return res.status(201).send({
                // Even If old password provided is wrong and if new password is not provided the profile name updates successfully
                // on https://pro-manage-jade.vercel.app/home/settings
                success: true,
                message: "User Updated Successfully",
                updatedUserFields,
                updatedCredentials: true
            });
        }
        else if ((editedUser.old_password === undefined && editedUser.new_password !== undefined)) {
            return res.status(501).send({
                success: false,
                message: "Please provide old password to confirm.Profile failed to update",
                editedUser,
            });
        }
        else if ((editedUser.old_password !== undefined && editedUser.new_password !== undefined)) {

            if (await bcryptjs.compare(editedUser.old_password, user.password)) {
                if (editedUser.old_password === editedUser.new_password) {
                    return res.status(501).send({
                        success: false,
                        message: "New Password is Same as Old Password. Please Provide Fresh password to update profile",
                        editedUser,
                    });
                }

                else {
                    if (editedUser.new_password.length >= 8) {
                        const salt = bcryptjs.genSaltSync(10);
                        const hashedPassword = await bcryptjs.hash(editedUser.new_password, salt);
                        const newEditedUser = {
                            name: req.body.name,
                            password: hashedPassword
                        }
                        const updated_user = { ...user._doc, ...newEditedUser }
                        console.log("line 98", updated_user)
                        await userModel.findByIdAndUpdate(req.body.id, updated_user, { new: true })
                        await authService.logoutUserAfterPasswordChange(req, res)


                        // router.post("/logout", authRouter.logoutController); // Not working


                    }
                    else {
                        return res.status(400).send({
                            success: false,
                            message: "New Password should be at least 8 characters long",
                            updated_user,
                        });
                    }
                }
            }

            else {
                console.log(await bcryptjs.compare(editedUser.old_password, user.password))
                return res.status(500).send({
                    success: false,
                    message: "Old password Does not match with stored password",
                    // updated_user,
                });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Error in Update User Api",
        });
    }
};


module.exports = { getUserController, updateUserController };
