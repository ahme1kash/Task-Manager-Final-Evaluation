const JWT = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/tokenBlacklistModel");

const getUserMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Please provide Auth Token",
            });
        }

        const blacklistedToken = await tokenBlacklistModel.findOne({ token });
        if (blacklistedToken) {
            return res.status(404).send({
                success: false,
                message:
                    "User is Logged out, Try LogIn again to perform User Operations",
            });
        }
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (err) {
        console.log(err);
        res.status(401).send({
            success: false,
            message: "Please provide Auth Token",
            err,
        });
    }
};
module.exports = getUserMiddleware;
