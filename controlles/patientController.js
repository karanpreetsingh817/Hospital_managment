const catchAsync = require("../utli/catchAsync");
const AppError = require("../utli/appError");
const Features=require("./../utli/apiFeature");
const Patient = require("../models/patientModel");
const Slot= require("../models/appoitmentModel");

const filterAllowed=(obj,...allowFields)=>{
    const newObj={};
    Object.keys(obj).forEach(el=>{
        if(allowFields.includes(el)){
            newObj[el]=obj[el]
        }
    })
    return newObj;
}


// handler function to handle req of getting details of all patients 
exports.allPatient=catchAsync(async(req,res,next)=>{
    let features=new Features(Patient.find(),req.query).filter().sort().fieldlimits().pagination();
    result = await features.query; 
    if(!result){
        return next(new Error("404 Not Found",404))
    }
    // const totalNum=result.length();
    res.status(200).json({
        status: "Successfull",
        statusCode:200,
        message:"Here details Of all Patients",
        // total:totalNum,
        result:result
    });
})


// function to handle req for particular patient
exports.myProfile=catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        message:"here detail of your Profile",
        result:req.User
    });
});


exports.makeappointment=catchAsync(async(req,res,next)=>{
    const st=req.body.startTime;
    const  name=req.body.doctorname;
    const doctor=await Doctor.findOne({name:name});
    const doctorId=doctor._id;
    const id=req.User._id;
    const appointment=await Slot.findAndUpdate({doctorId:doctorId,startTime:st},{patientId:id});
    if(!appointment){
        return(next("Sry for incovinence!!! you are not able to make appointment at this momment"))
    }
    res.status(200).json({
        status:"success",
        message:"Your request for appointment is being under prrocess",
        result:appointment 
    });
})

// exports.updatePatient=catchAsync(async(req,res,next)=>{
//     res.status(200).json({
//         status:"successfull",
//         statusCode:200,
//         result:"update patient successfully"
//     });
// });


// fumctiomn to update the data of exsiting patient
exports.updateMe=catchAsync(async(req,res,next)=>{
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


// function  which hamndle delete request of exsiting patient
exports.deletePatient=catchAsync(async(req,res,next)=>{
 user=await Patient.findByIdAndUpdate(req.User._id,{active:false});
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        message:"patient deleted successfully",
        result:"delete successfully"
    });
});


// function handle to route to find all patients for todays appointment
exports.todaysPateints=catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        message:"here details of Todays appointed patients",
        result:"todays patients"
    });
});

// exports.allPatientOfDoctor=catchAsync(async(req,res,next)=>{
    
// })