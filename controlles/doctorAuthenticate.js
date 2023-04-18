const { promisify } = require("util");
const catchAsync = require("../utli/catchAsync");
const Doctor = require("../models/doctorModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utli/appError");
const sendEmail = require("../utli/email");

const signToken = (id) =>
    jwt.sign({ id }, process.env.SECERT_STR, {
        expiresIn: process.env.EXPIRE_IN,
    });

const sendToken=(res,newDoctor,str)=>{
    const token = signToken(newDoctor._id);
    res.cookie("Jwt",token,{
        httpOnly:true
    })
    newDoctor.password=undefined;
    res.status(200).json({
        status: "Successfull !",
        statusCode: 200,
        message:str,
        result:token
    });
}

 // ------------------------------------------------------------------------------------------------------
// function to handle signUp request of new patient
exports.signUp = catchAsync(async (req, res, next) => {
    const newDoctor = await Doctor.create({
        name:req.body.name,
        email:req.body.email,
        age:req.body.age,
        experience:req.body.experience,
        specialization:req.body.specialization,
        description:req.body.description,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword
    });

    if (!newDoctor) {
        return next(new AppError(404, "errror ............"));
    }
    sendToken(res,newDoctor,"new Doctor Register Successfully");
});

// ----------------------------------------------------------------------------------------------
// function handle and varification for login
exports.logIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError(404, "plz provide email and password" ));
    }
    const user = await Doctor.findOne({ email }).select("+password");
    if (!user) {
        return next(new AppError(404, "user not found"));
    }
    isVarified = await user.correctUser(password, user.password);
    if (!isVarified) {
        return next(new AppError(404, "invalid password"));
    }
    sendToken(res,user,"You login  successfully");
});


// --------------------------------------------------------------------------------------------
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authentication  && req.headers.authentication.startsWith("Bearer")) {
        token = req.headers.authentication.split(" ")[1];
    }
    if (!token) {
        return next(new AppError(401, "token is not valid!!!!"))
    }
    const decode = await promisify(jwt.verify)(token, process.env.SECERT_STR);
    const isUser = await Doctor.findById(decode.id);
    if (!isUser){
        return next(new AppError(400, "User  belonging to token is not exists"));
    }
    if (await isUser.validatePass(decode.iat)){
        return next( new AppError(400, "User recentely Changed password!! Plz logIn again"));
    }
    req.User = isUser;
    next();
});


// -------------------------------------------------------------------------------------------------
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.User.role)) {
            return next(new AppError(403, "You are not Allow to do This action"));
        }
        next();
    };
};

// -----------------------------------------------------------------------------------------
exports.forgetPassword = catchAsync(async (req, res, next) => {
    const user = await Doctor.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError(404, "Email is not registered"))
    }
    // crreate random token
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


// ---------------------------------------------------------------------------------------------
exports.resetPassword = catchAsync(async(req, res, next) => {
    resetHashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const doctor=await Doctor.findOne({passwordResetToken:resetHashedToken, passwordResetExpires:{$gt:Date.now()}});
    if(!doctor){
        return next(new AppError(401,"your token is expired plz make request for reset password again"))
    }
    doctor.password=req.password;
    doctor.confirmPassword=undefined;
    doctor.passwordResetToken=undefined;
    doctor.passwordResetExpires=undefined;
    await doctor.save();
    sendToken(res,doctor,"your password reset successfully");
})

// ------------------------------------------------------------------------------------------
exports.updatePassword=catchAsync(async(req,res,next)=>{
    const doctor=await Doctor.findById(req.User.id).select("+password");
    isVarified = await doctor.correctUser(req.body.currentPassword, doctor.password);
    if (!isVarified) {
        return next(new AppError(404, "Plz try with different password not with current one "));
    }
    doctor.password=req.body.password;
    doctor.confirmPassword=req.body.confirmPassword;
    await doctor.save();
    res.status(200).json({
        status:"success",
        statusCode:200,
        message:"your new password updated successfully",
        result:doctor
    })
})