const AppError = require("../utli/appError");

const sendDevError=(err,res)=>{
    res.status(err.statusCode).json({
        err,
        statusCode:err.statusCode,
        status:err.status,
        message:err.message,
        result:err.stack
    })
};

const sendProdError=(err,res)=>{
   
    if(err.isOperational){
        res.status(err.statusCode).json({
            
            statusCode:err.statusCode,
            status:err.status,
            message:err.message,
            result:err.name
        })
    }
    else{
       
        res.status(500).json({
            statusCode:500,
            status:"Error",
            message:"Something Went Very Wrong"
        })
    }
}

const validationHandler=()=> new AppError(401,"Plz fill all detilas and email which is not registered")
const jwtErrHandler=()=> new AppError(401,"JWT token is not valid ")
const tokenExpHandler=()=> new AppError(401,"JWT token expired!!!Plz login again")
 
//this function is used to handle glober error routes
module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.status=err.status || "server error";
    if(process.env.NODE_ENV==="development"){
        sendDevError(err,res);
    }else if(process.env.NODE_ENV=="production"){
        if(err.name==="ValidationError") err= validationHandler()
        if(err.name==="JsonWebTokenError") err=jwtErrHandler()
        if(err.name==="TokenExpiredError") err=tokenExpHandler()   
    sendProdError(err,res);
    }
};