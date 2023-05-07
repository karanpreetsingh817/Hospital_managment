const catchAsync = require("../utli/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utli/appError");
const sendEmail = require("../utli/email");
const { promisify } = require("util");




const signToken = (id) =>
    jwt.sign({ id }, process.env.SECERT_STR, {
        expiresIn: process.env.EXPIRE_IN,
    });

const sendToken = (res, user) => {
    const token = signToken(user._id);
    res.cookie("Jwt", token, {
        httpOnly: true
    })
    user.password = undefined;
    res.status(200).json({
        status: "Successfull !",
        statusCode: 200,
        message: "you loged in successfully",
        result: token,
        user
    });
}
/*  
    This function is called whenever  add new Member to our website
    All validations, Password hashing and security related Best practices 
    implimented Here.
*/
exports.signUp = (model) => catchAsync(async (req, res, next) => {
    console.log(req.data.profileImg);
    const user = await model.create(req.data);
    console.log("done ho gya bhai")

    if (!user) {
        return next(new AppError(404, "errror ............"));
    }
    sendToken(res, user);
});

/*  This is logIn route Controller Both for all user.
    Whenever existing Patient try to logIn inn Our system
    Then this RoutHandler comes into Picture
*/
exports.logIn = (model) => catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError(404, "plz provide email and password"));
    }
    const user = await model.findOne({ email }).select("+password");
    if (!user) {
        return next(new AppError(404, "user not found"));
    }
    isVarified = await user.correctUser(password, user.password);
    if (!isVarified) {
        return next(new AppError(404, "invalid password"));
    }
    sendToken(res, user, "You login  successfully");
});

/*  This Route handler Actully check Who req in our system, Actully 
    his/her Data is present in Our system or not. If User  Athenticate
    successfully then only further Request is processed  otherWise throw
    an Error
*/
exports.protect = (model) => catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authentication && req.headers.authentication.startsWith("Bearer")) {
        token = req.headers.authentication.split(" ")[1];
    }
    if (!token) {
        return next(new AppError(401, "token is not valid!!!!"))
    }
    const decode = await promisify(jwt.verify)(token, process.env.SECERT_STR);
    const isUser = await model.findById(decode.id);
    if (!isUser) {
        return next(new AppError(400, "User  belonging to token is not exists"));
    }
    if (await isUser.validatePass(decode.iat)) {
        return next(new AppError(400, "User recentely Changed password!! Plz logIn again"));
    }
    req.User = isUser;
    next();
});

/*  This middleWare just Check whether a paarticuler Route
    is allow to User or not. If Not the return Error That
    You are not allow To do this action.
*/
// exports.restrictTo=(...roles)=> () => {
//     return (req, res, next) => {
//         if (!roles.includes(req.User.role)) {
//             return next(new AppError(403, "You are not Allow to do This action"));
//         }
//         next();
//     };
// };

/*  route is called when Doctor Forget his Password and 
    want to reset hie?her password. An password Reset link
    is genrated and send to Registered Email.
*/
exports.forgetPassword = (model) => catchAsync(async (req, res, next) => {
    const user = await model.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError(404, "Email is not registered"))
    }
    resetToken = user.createPassResetToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.get("host")}/v1/patient/resetpassword/${resetToken}`;
    const message = `Have you forget your password? here Password reset link.Click on link ${resetUrl} and reset your password.If you did't apply for reset Password Kindly ignore this email`;
    await sendEmail({
        email: user.email,
        suject: "reset password link is valid for 10 min Only",
        message
    });
    res.status(200).send("your password reset link is send to your mail");
});

/*  After sending Password reset token, Whenever user click on That link,
    this Route will be called and user easily set Their new password .
*/
exports.resetPassword = (model) => catchAsync(async (req, res, next) => {
    resetHashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await model.findOne({ passwordResetToken: resetHashedToken, passwordResetExpires: { $gt: Date.now() } });
    if (!user) {
        return next(new AppError(401, "your token is expired plz make request for reset password again"))
    }
    user.password = req.password;
    user.confirmPassword = undefined;
    user.passwordResetToken = undefined;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    sendToken(res, user);
});

/*  If doctor Want to Update his password and he/she know 
    their current password then only able to Update Thier 
    password
*/
exports.updatePassword = (model) => catchAsync(async (req, res, next) => {
    const user = await model.findById(req.User.id).select("+password");
    isVarified = await user.correctUser(req.body.currentPassword, user.password);
    if (!isVarified) {
        return next(new AppError(404, "Plz try with different password not with current one "));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "your new password updated successfully",
        result: user
    })
})

