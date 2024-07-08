const tokenBlacklist = [];
const userModel = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const JWT = require("jsonwebtoken");
const registerController = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        res.json({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        })
        if (!name || !email) {
            return res.status(500).send({
                success: false,
                credentials: req.body,
                message: "Some User fields are Missing.",
            });
        }
        else if (password !== confirmPassword) {
            console.log("Passwords dont match")
            return res.status(404).send({
                success: false,
                message: "Your Password doesn't match",
            });
        }
        //?check user
        const existing = await userModel.findOne({ email });
        if (existing) {
            return res.status(500).send({
                success: false,
                message: "Email is Already Registered",
            });
        }
        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        //* Create a New User
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,

        });
        console.log("38", user)
        return res.status(201).send({
            success: true,
            message: "New User Registered Successfully",
            user,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in register API",
            err,
        });
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validation
        //^ Login value(s) missing.
        if (!email || !password) {
            return res.status(500).send({
                successs: false,
                message: "Both Email and Passowrd are required for Secure LogIn 😊",
            });
        }

        //^ checkUSer

        const user = await userModel.findOne({ email });
        //& USER NOT Found
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Invalid Credentials",
            });
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).send({
                success: false,
                message: "Invalid  Credentials",
            });
        }
        // ^ token generation
        const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        //* USER Found Successfully
        if (isMatch && user.email === email) {
            user.password = undefined; //*& hiding the password from the server response of user
            return res.status(200).send({
                success: true,
                message: "Secured Login Successful🔥",
                user: [user.email, user.name],
                token,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            succcess: false,
            message: "Error in LogIn API",
            err,
        });
    }
};
const logoutController = async (req, res) => {
    try {
        const token = req.headers["authorization"].split(" ")[1];
        JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: "Un-Authorized User or User already logged out.",
                });
            } else {
                tokenBlacklist.push(token);
                console.log(tokenBlacklist)

                return res.status(200).send({
                    success: true,
                    message: "User Logged out successfully",
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in Logout API, Internal Server Error",
        });
    }
};
module.exports = {
    registerController,
    loginController,
    logoutController,
    tokenBlacklist,
};
