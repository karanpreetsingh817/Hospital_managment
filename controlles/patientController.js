const catchAsync = require("../utli/catchAsync");

// handler function to handle req of getting details of all patients 
exports.allPatient=catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        result:"there is information of all patients"
    });
})

// function to handle req for particular patient
exports.onePatient=catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        result:"there is information of one patients"
    });
});

// function to add new patient in data base
exports.addPatient=catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        result:"add new patient successfully"
    });
});

// fumctiomn to update the data of exsiting patient
exports.updatePatient=catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        result:"update of pateint detail succesfully"
    });
});

// function  which hamndle delete request of exsiting patient
exports.deletePatient=catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        result:"delete successfully"
    });
});

// function handle to route to find all patients for todays appointment
exports.todaysPateints=catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        result:"todays patients"
    });
});