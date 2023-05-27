const catchAsync = require("../utli/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utli/appError");
const sendEmail = require("../utli/email");
const { promisify } = require("util");
const crypto = require("crypto");



const signToken = (id) =>
    jwt.sign({ id }, process.env.SECERT_STR, {
        expiresIn: process.env.EXPIRE_IN,
    });

const sendToken = (res, user) => {
    const token = signToken(user._id);
    user.password = undefined;
    
    if(user.role==="doctor"){
        res.cookie("role", "doc-profile", {
            httpOnly: false,
            sameSite: false,
    
        })
        
    }
    if(user.role==="user"){
        res.cookie("role", "profile", {
            httpOnly: false,
            sameSite: false,
    
        })

    }
    if(user.role==="admin"){
        res.cookie("role", "admin", {
            httpOnly: false,
            sameSite: false,
    
        })
    }
   
    res.cookie("Jwt", token, {
        httpOnly: false,
        sameSite: false,

    }).cookie("username", user.name, {
        httpOnly: false,
        sameSite: false,
    });
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
    const sessionOtp = req.session.otp; 
    if(sessionOtp && sessionOtp == req.body.OTP){
        const user = await model.create(req.data);
        if (!user) {
            return next(new AppError(404, "errror ............"));
        }
        sendToken(res, user);
    }else{
        return next(new AppError(403, 'Invalid OTP!'))
    }
});

/*  This is logIn route Controller Both for all user.
    Whenever existing Patient try to logIn inn Our system
    Then this RoutHandler comes into Picture
*/
exports.logIn = (model) => catchAsync(async (req, res, next) => {
  
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError(400, "Plz provide email and password"));
    }
    const user = await model.findOne({ email }).select("+password");
    if (!user) {
        return next(new AppError(400, "Email Or Password is incorrect!! Plz Fill Correct Email and Password and Try again "));
    }
    isVarified = await user.correctUser(password, user.password);
    if (!isVarified) {
        return next(new App2Error(400, "invalid password"));
    }
    sendToken(res, user);
});

/*  This Route handler Actully check Who req in our system, Actully 
    his/her Data is present in Our system or not. If User  Athenticate
    successfully then only further Request is processed  otherWise throw
    an Error
*/
exports.protect = (model) => catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
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
    let page;
    if(user.role==="user"){
        page="patientreset-pass"
    }
    if(user.role==="doctor" || user.role==="admin"){
        page="doctorreset-pass"
    }
    resetToken = user.createPassResetToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://localhost:3000/${page}/${resetToken}`;
    const message =  `
    Dear User,
    
    Have you forgotten your password? We're here to help you regain access to your account.
    
    To reset your password, please click on the following link:
    ${resetUrl}
    
    If you didn't request a password reset, please ignore this email. Your account is still secure.
    
    Thank you for using HealthEase!
    
    Best regards,
    HealthEase Team`;
    await sendEmail({
        email: user.email,
        subject: "reset password link is valid for 10 min Only",
        message
    });
    res.status(200).send("your password reset link is send to your mail");
});

/*  After sending Password reset token, Whenever user click on That link,
    this Route will be called and user easily set Their new password .
*/
exports.resetPassword = (model) => catchAsync(async (req, res, next) => {
    resetHashedToken = crypto.createHash("sha256").update(req.body.token).digest("hex");
    const user = await model.findOne({ passwordResetToken: resetHashedToken, passwordResetExpires: { $gt: Date.now() } });
    if (!user) {
        return next(new AppError(401, "your token is expired plz make request for reset password again"))
    }
    console.log(user)
    user.password = req.body.password;
    user.confirmPassword = undefined;
    user.passwordResetToken = undefined;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    console.log(user)
    await user.save({ validateBeforeSave: false });
    console.log(user)
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


exports.genrateOtp=catchAsync(async(req,res,next)=>{
    const Otp  = Math.floor(1000 + Math.random() * 9000);
   
    message=`
    Dear ${req.body.name},

    We hope this email finds you well. As part of our enhanced security measures, we are implementing a one-time password (OTP) verification process for your account. This added layer of security ensures that your personal information remains protected.
    
    To complete the verification process, please find your OTP details below:
    
    OTP: ${Otp}
    
    Please note that this OTP is valid for a limited time and should be used for verification purposes only. Do not share this OTP with anyone, including anyone claiming to be from our support team.
    
    If you did not initiate this request or believe it to be an error, please contact our support team immediately at [Customer Support Contact Details] so that we can assist you further.
    
    Thank you for your cooperation in this matter. We appreciate your commitment to account security.
    
    Best regards,
    
    Karanpreet Singh
    HealthCare
    healthease90009@gmail.com`

    await sendEmail({
        email: req.body.email,
        subject: "Email verification",
        message
    });
   
    req.session.otp = Otp; 
    req.session.save();
    console.log(Otp,"---------------",req.session.otp)
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        message:"Otp send to your mail successfully",
        result:"done"
    })
    
})