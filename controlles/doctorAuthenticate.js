const Doctor = require("../models/doctorModel");
const authFactory=require("./authFactory");
const AppError=require("./../utli/appError")

exports.signUp = authFactory.signUp(Doctor);
exports.logIn = authFactory.logIn(Doctor)
exports.protect = authFactory.protect(Doctor)
exports.restrictTo =(...roles)=> {
    return (req, res, next) => {
        if (!roles.includes(req.User.role)) {
            return next(new AppError( 403,"You are not Allow to do This action"));
        }
        next();
    };
};

exports.forgetPassword = authFactory.forgetPassword(Doctor);
exports.resetPassword = authFactory.resetPassword(Doctor);
exports.updatePassword=authFactory.updatePassword(Doctor);