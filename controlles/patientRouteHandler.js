const catchAsync = require("../utli/catchAsync");

// const {allPatient,onePatient,addPatient,updatePatient,deletePatient}=require("") 
exports.allPatient=catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        result:"there is information of all patients"
    });
})
exports.onePatient=catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        result:"there is information of one patients"
    });
});

exports.addPatient=catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        result:"add new patient successfully"
    });
});


exports.updatePatient=catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        result:"update of pateint detail succesfully"
    });
});


exports.deletePatient=catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        result:"delete successfully"
    });
});

exports.todaysPateints=catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        result:"todays patients"
    });

});