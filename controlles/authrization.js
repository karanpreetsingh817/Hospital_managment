const { promisify } = require("util");
const catchAsync = require("../utli/catchAsync");
const Patient = require("../models/patientModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utli/appError");
const sendEmail = require("./../utli/email");
const bcrypt=require("bcryptjs")

const signToken = (id) =>
    jwt.sign({ id }, process.env.SECERT_STR, {
        expiresIn: process.env.EXPIRE_IN,
    });

 // ------------------------------------------------------------------------------------------------------
// function to handle signUp request of new patient
exports.signUp = catchAsync(async (req, res, next) => {
    const newPatient = await Patient.create({
        name: req.body.name,
        age: req.body.age,
        address: req.body.address,
        bloodGroup: req.body.bloodGroup,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });

    if (!newPatient) {
        return next(new AppError(404, "errror ............"));
    }

    const token = signToken(newPatient._id);
    res.status(200).json({
        message: "Successfull !",
        token: token,
        status: 200,
        result: newPatient,
    });
});

// ----------------------------------------------------------------------------------------------
// function handle and varification for login
exports.logIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError(404, "plz provide email and password"));
    }

    const user = await Patient.findOne({ email }).select("+password");
    if (!user) {
        return next(new AppError(404, "user not found"));
    }

    isVarified = await user.correctUser(password, user.password);
    if (!isVarified) {
        return next(new AppError(404, "invalid password"));
    }

    const token = signToken(user._id);
    res.status(200).json({
        login: "succsefull",
        token,
    });
});

// --------------------------------------------------------------------------------------------
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authentication && req.headers.authentication.startsWith("Bearer")) {
        token = req.headers.authentication.split(" ")[1];
    }

    if (!token) return next(new AppError(401, "token is not valid!!!!"));
    const decode = await promisify(jwt.verify)(token, process.env.SECERT_STR);

    const isUser = await Patient.findById(decode.id);
    if (!isUser)
        return next(new AppError(400, "User  belonging to token is not exists"));

    if (await isUser.validatePass(decode.iat))
        return next( new AppError(400, "User recentely Changed password!! Plz logIn again"));
        
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
    const user = await Patient.findOne({ email: req.body.email });
    if (!user) return next(new AppError(404, "Email is not registered"));

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
    const patient=await Patient.findOne({passwordResetToken:resetHashedToken, passwordResetExpires:{$gt:Date.now()}});
    if(!patient){
        return next(new AppError(401,"your token is expired plz make request for reset password again"))
    }

    patient.password=req.password;
    patient.confirmPassword=undefined;
    patient.passwordResetToken=undefined;
    patient.passwordResetExpires=undefined;
    await patient.save();

    const token = signToken(user._id);
    res.status(200).json({
        login: "succsefull",
        token,
    });
})

exports.updatePassword=catchAsync(async(req,res,next)=>{
    
    patient=await Patient.findById(req.id).select("+password");

    isVarified = await patient.correctUser(req.body.confirmPassword, patient.password);
    if (!isVarified) {
        return next(new AppError(404, "Your current password is not valid"));
    }
    
   
    patient.password=req.body.password;
    patient.confirmPassword=req.body.confirmPassword;
    await patient.save();


})