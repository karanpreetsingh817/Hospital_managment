const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const doctorsRoute = require("./routers/doctorsRoute");
const patientsRoute = require("./routers/patientsRoute");
const reportsRoute = require("./routers/reportRoute");
const appointmentRoute = require("./routers/appointmentRoute");
const globalErrorHandler = require("./controlles/errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors")
const cookieParser = require("cookie-parser");

dotenv.config({ path: './config.env' });

const app = express();
app.use(cookieParser())
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
app.use(allowCrossDomain)

app.use(cors({
   "origin" : "http://172.174.139.118:3000",
    "credentials": true, 
}));

const limiter = rateLimit({
    max: 900,
    windowMs: 60 * 60 * 1000,
    message: "your request limit exceeded..!!!! Plz try again after one hour"
});

app.use(require('body-parser').json());
app.use(express.urlencoded({ extended: true }));

app.use(mongoSanitize());

app.use(xss());
app.use(helmet());

app.use("/v1", limiter);
app.use(express.json());


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
app.use("/v1/report", reportsRoute);


app.use("/v1/appointment", appointmentRoute)


app.use("/v1/doctor", doctorsRoute);

app.use("/v1/patient", patientsRoute);

// app.get("/temp",(req,res)=>{
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Cache-Control", "no-cache");
//     res.setHeader("connection", "keep-alive");
//     res.setHeader("Content-Type", "text/event-stream");
//     let ct=0;
//     setInterval(()=>{
//         res.write(`data : ${ct}\n\n`);
//         ct++;
//     },2000)
    
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
