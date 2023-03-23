
exports.todayAvailbleDoctor= (req,res)=>{
    res.status(200).json({
        status:"success",
        statusCode:200,
        result:"done"
    });

};

exports.allDoctors=(req,res)=>{
    res.status(200).json({
        status:"success",
        statusCode:200,
        result:"there result of all docrtor request"
    });

}
exports.oneDoctor=(req,res)=>{
    res.status(200).json({
        status:"success",
        statusCode:200,
        result:"This is perticular dr. detail"
    });

};

exports.addDoctor=(req,res)=>{
    res.status(200).json({
        status:"success",
        statusCode:200,
        result:"New doctor added successfully"
    });

};
exports.updateDoctor=(req,res)=>{
    res.status(200).json({
        status:"success",
        statusCode:200,
        result:"New doctor added successfully"
    });

}
exports.deleteDoctor=(req,res)=>{
    res.status(200).json({
        status:"success",
        statusCode:200,
        result:"New doctor added successfully"
    });

}
