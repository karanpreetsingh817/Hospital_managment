const express=require("express");
const mongoose=require("mongoose");
const doctorsRoute=require("./routers/doctorsRoute");
const patientsRoute=require("./routers/patientsRoute");
const app=express();

app.use(express.json());

app.use("*",(req,res,next)=>{
    console.log("global-middleware is on duty");
    next();
});

app.use("/v1/doctor",doctorsRoute);
app.use("/v1/patient",patientsRoute);

app.all("*",(req,res,next )=>{
    res.status(400).json({
        status:"Bad Request",
        statusCode:400,
        result:`${req.originalUrl} is no longer to accessable`
    })
})

// app.use(globalError);











app.listen(8080,(req,res)=>{
    console.log("server is listening on port 8080");
});