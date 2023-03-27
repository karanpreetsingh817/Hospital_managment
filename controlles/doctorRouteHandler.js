const catchAsync=require("./../utli/catchAsync")
exports.todayAvailbleDoctor=catchAsync(async (req,res)=>{
    res.status(200).json({
        status:"success",
        statusCode:200,
        result:"done"
    });

});

exports.allDoctors=catchAsync(async(req,res)=>{
    res.status(200).json({
        status:"success",
        statusCode:200,
        result:"there result of all docrtor request"
    });

});


exports.oneDoctor=catchAsync(async(req,res)=>{
    res.status(200).json({
        status:"success",
        statusCode:200,
        result:"This is perticular dr. detail"
    });

});

exports.addDoctor=catchAsync(async(req,res)=>{
    res.status(200).json({
        status:"success",
        statusCode:200,
        result:"New doctor added successfully"
    });

});


exports.updateDoctor=catchAsync(async(req,res)=>{
    res.status(200).json({
        status:"success",
        statusCode:200,
        result:"New doctor added successfully"
    });

});


exports.deleteDoctor=catchAsync(async(req,res)=>{
    res.status(200).json({
        status:"success",
        statusCode:200,
        result:"New doctor added successfully"
    });

});
