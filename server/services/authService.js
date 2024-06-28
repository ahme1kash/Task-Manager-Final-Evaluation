const bcryptjs = require('bcryptjs');
const userModel = require('../models/userModel');
const { logoutController } = require('../controllers/authController');


async function logoutUserAfterPasswordChange(req, res) {
    await logoutController(req, res);
}

module.exports = {
    // updateUserPassword,
    logoutUserAfterPasswordChange,
};
