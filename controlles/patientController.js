const catchAsync = require("../utli/catchAsync");
const AppError = require("../utli/appError");
const Patient = require("../models/patientModel");
const handlerFactory=require("./handlerFactory")
const cloudinary = require("cloudinary");
const mongoose=require("mongoose")


exports.uploadImg=catchAsync(async(req,res,next)=>{
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    })
    const path=await req.files.profileImg.path
    const result=await cloudinary.uploader.upload(path);
    res.json({
        url:result.secure_url,
        public_id:result.public_id
    });
})


exports.showProfile=catchAsync(async(req,res,next)=>{ 
    let {patientId}=req.query;
    console.log(patientId)
    patientId=new mongoose.Types.ObjectId(patientId)
    const patient=await Patient.findById(patientId);
    console.log(patient)

    res.status(200).json({
        status:"successfull",
        statusCode:200,
        message:"here detail of your Profile",
        result:patient
    });
})


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
        phoneNumber: req.body.mobile,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        profileImg:req.body.image
    }
    console.log(data)
    req.data=data;
    next();
}
/*  tHIS  route is handle request of Details of all Patients
    This request is noly valid for Admin
*/

exports.getAllPatients=catchAsync(async(req,res,next)=>{
    // let features=new Features(Patient.find(),req.query).filter().sort().fieldlimits().pagination();

    result = await Patient.find();
    if(!result){
        return next(new AppError(404,"404 Not Found"))
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
    const name=req.body.name|| patient.name;
    const email=req.body.email || patient.email;
    const patient=await Patient.findByIdAndUpdate(req.User._id,{name,email});
    console.log(patient)
    if(req.body.name && patient){
        res.cookie("username", req.body.name, {
            httpOnly: false,
            sameSite: false,
        })
    }
    console.log("after Save====>",patient)
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

exports.deleteOn=catchAsync(async (req, res,next) => {
    console.log(req.params.id)
    const document=await Patient.findByIdAndUpdate(req.params.id,{active:false});
    console.log(document);
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Document Deleted successfully",
        result:document
    });
})

exports.getPatientByName=catchAsync(async(req,res,next)=>{
    const name=req.query.name;
    console.log(name)
    const patient=await Patient.find({name:name});
    console.log(patient)
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        message:"here detail of your Profile",
        result:patient
    });
});