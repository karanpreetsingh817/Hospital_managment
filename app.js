const express=require("express");
const mongoose=require("mongoose");
const doctorsRoute=require("./routers/doctorsRoute");
const patientsRoute=require("./routers/patientsRoute");
const dotenv=require("dotenv");


const app=express();


dotenv.config({path:'./config.env'});
port=process.env.PORT||7000;


app.use(express.json());
const db=process.env.DATABASE;


mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(data => {
    console.log("connection succsefully with atlas")
}).catch(err => {
    console.log("error error !!!");
});



app.use((req,res,next)=>{
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












app.listen(8080,(req,res)=>{
    console.log(`server is listening on port ${port}`);
});