const {promisify}=require("util")
const catchAsync = require("./../utli/catchAsync");
const Patient = require("./../models/patientModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utli/appError");


const signToken=id=> jwt.sign({ id}, process.env.SECERT_STR,{expiresIn:process.env.EXPIRE_IN});

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
        confirmPassword: req.body.confirmPassword
    })
    if (!newPatient) {
        return next(new AppError(404, 'errror ............'));
    }
    const token = signToken(newPatient._id);
    res.status(200).json({
        message: "Successfull !",
        token: token,
        status: 200,
        result: newPatient
    });
});

// function handle and varification for login
exports.logIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError(404, "plz provide email and password"));
    }

    const user = await Patient.findOne({ email }).select('+password');
    if (!user) return next(new AppError(404, "user not found"));


    isVarified = await user.correctUser(password, user.password);
    if (!isVarified) return next(new AppError(404, "invalid password"));
    
    const token=signToken(Patient._id);
    res.status(200).json({
        login: "succsefull",
        token
    })
});

exports.protect=catchAsync(async(req,res,next)=>{
    
    let token;
    if(req.headers.authentication && req.headers.authentication.startsWith("Bearer")) token=req.headers.authentication.split(" ")[1];    
          
    if(!token) return next(new AppError(401,"token is not valid!!!!"))
    
    const decode=await promisify(jwt.verify)(token,process.env.SECERT_STR)
    
    const isUser=await Patient.findById(decode.id);
    if(!isUser) return next(new AppError(400,"User  belonging to token is not exists"));

    if(isUser(decode.iat)) return next(new AppError(400,"User recentely Changed password!! Plz logIn again"))

    req.body.isUser=isUser;
    next();
});