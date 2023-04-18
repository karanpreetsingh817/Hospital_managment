const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const doctorsRoute = require("./routers/doctorsRoute");
const patientsRoute = require("./routers/patientsRoute");
const globalErrorHandler=require("./controlles/errorController");
const rateLimit=require("express-rate-limit");
const helmet=require("helmet");
const mongoSanitize=require("express-mongo-sanitize");
const xss=require("xss-clean");
const catchAsync = require("./utli/catchAsync");

const limiter=rateLimit({
    max:90,
    windowMs:60*60*1000,
    message:"your request limit exceeded..!!!! Plz try again after one hour"
});

const app = express();
app.use(mongoSanitize());
app.use(xss());
app.use(helmet());

app.use(require('body-parser').json());
app.use("/v1",limiter);
app.use(express.json());

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 7000;
const db = process.env.DATABASE;

// here we connect our application to backend
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(data => console.log("connection succsefully with atlas"))
    .catch(err => console.log("error error !!!"));

// All routes define here
app.use("/v1/doctor", doctorsRoute);
app.use("/v1/patient", patientsRoute);

// app.get("/ap",async(req,res)=>{
//     const model=require("./models/appoitmentModel")
//   const y=  await new model({

//         slotTime:Date.now(),
//         "patientId":'33434'
        
//     }).save();
//     const oj=JSON.parse(JSON.stringify(y))
//     delete oj["_id"];
//     delete oj["__v"];
//     delete oj["patientId"]
//     console.log(y)
//     await model.findByIdAndUpdate(y._id,y)

// })

// this gloal middleware is  handle unHandeled routes 
app.all("*", (req, res, next) => {
    res.status(400).json({
        status: "Bad Request",
        statusCode: 400,
        result: `${req.originalUrl} is no longer to accessable`
    });
});


// global error handler middleware
app.use(globalErrorHandler);

// creating server at local host port 8080
app.listen(port, (req, res) => {
    console.log(`server is listening on port ${port}`);
});