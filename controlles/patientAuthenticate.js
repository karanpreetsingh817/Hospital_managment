const Patient = require("../models/patientModel");
const authFactory=require("./authFactory");

exports.signUp = authFactory.signUp(Patient);
exports.logIn = authFactory.logIn(Patient)
exports.protect = authFactory.protect(Patient)
exports.restrictTo =(...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.User.role)) {
            return next(new AppError(403, "You are not Allow to do This action"));
        }
        next();
    };
};

exports.forgetPassword = authFactory.forgetPassword(Patient);
exports.resetPassword = authFactory.resetPassword(Patient);
exports.updatePassword=authFactory.updatePassword(Patient);