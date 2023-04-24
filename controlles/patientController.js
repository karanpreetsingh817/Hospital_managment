const catchAsync = require("../utli/catchAsync");
const AppError = require("../utli/appError");
const Features=require("./../utli/apiFeature");
const Patient = require("../models/patientModel");
const handlerFactory=require("./handlerFactory")

const filterAllowed=(obj,...allowFields)=>{
    const newObj={};
    Object.keys(obj).forEach(el=>{
        if(allowFields.includes(el)){
            newObj[el]=obj[el]
        }
    })
    return newObj;
}


exports.setData=(req,res,next)=>{
    data={
        name: req.body.name,
        age: req.body.age,
        address: req.body.address,
        bloodGroup: req.body.bloodGroup,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        reports:req.body.reports
    }
    req.data=data;
    next();
}
/*  tHIS  route is handle request of Details of all Patients
    This request is noly valid for Admin
*/
exports.getAllPatients=catchAsync(async(req,res,next)=>{
    let features=new Features(Patient.find(),req.query).filter().sort().fieldlimits().pagination();
    result = await features.query; 
    if(!result){
        return next(new Error(404,"404 Not Found"))
    }
    res.status(200).json({
        status: "Successfull",
        statusCode:200,
        message:"Here details Of all Patients",
        result:result
    });
})

/*  This route  is called when patient want to view his 
    details This  route is only for patient route.
*/
exports.getMyProfile=catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        message:"here detail of your Profile",
        result:req.User
    });
});

/*  This route handle request of updating details of
    Patient.This route is only for updating name and 
    email of patient.
*/
exports.updatePatient=catchAsync(async(req,res,next)=>{
    const {password,confirmPassword}=req.body;
    if(password || confirmPassword){
        return next(new AppError(401,"this Route is not availale for updating password. For updating Password Plz visit /updatePassword route."))
    };
    const filteredBody=filterAllowed(req.body,"name","email");
    const patient=await Patient.findByIdAndUpdate(req.User.id,filteredBody,{
        new:true,
        runValidators:true
    });
    res.status(200).json({
        status:"success",
        message:"user data has been updated",
        result:patient
    });
});

/*  this route is handle request of delete patients data from
    data base.Login must required in this case.
*/
exports.deletePatient=handlerFactory.deleteOne(Patient);

/*  This routeHandler is handle request for getting request  for specific doctor 
    to get all patients details whome get appointed
*/
exports.getTodaysPateints=catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        message:"here details of Todays appointed patients",
        result:"todays patients"
    });
});