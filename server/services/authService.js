const { logoutController } = require('../controllers/authController');


async function logoutUserAfterPasswordChange(req, res) {
    // let password_updated = true
    const status = {
        isPasswordChanged: req.body.true
    }
    await logoutController(req, res);
}

module.exports = {
    // updateUserPassword,
    logoutUserAfterPasswordChange,
};
