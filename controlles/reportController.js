const Report=require("./../models/reportsModel");
const catchAsync = require("../utli/catchAsync");
const AppError = require("../utli/appError");
exports.addReport=catchAsync(async(req,res,next)=>{
    const newReport = await Report.create(req.body);
    res.status(201).json({
        result:newReport,
        status:"sucessfull"
    })
})

exports.allReports=catchAsync(async(req,res,next)=>{
   const report=await req.User.populate("reports");
    if(!report){
        return next(new AppError("reports are not availale",401))
    }
    res.status(200).json({
        status:"successfull",
        report
    })
});

