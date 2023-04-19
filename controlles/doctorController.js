const AppError = require("../utli/appError");
const catchAsync = require("../utli/catchAsync");
const Doctor=require("./../models/doctorModel");
const Slot=require("./../models/appoitmentModel");

// 1.Route to handle query of all available doctors
exports.todayAvailbleDoctor = catchAsync(async (req, res,next) => {
    const doctor=await Doctor.find({ isAvailble:true });
    if(!doctor){
        return next(new AppError("Sry there is no Doctor availabe today ",400));
    }
    res.status(200).json({
        status: "success",
        statusCode: 200,
        result:doctor
    });
});


exports.myProfile=catchAsync(async(req,res,next)=>{
    const myDetail=Doctor.findById(req.User._id);
    if(!myDetail){
        return next(new AppError("Sry there is a problem !! PLZ try again Later"));
    }
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        result:myDetail
    })


})

// function to handle query to find all doctors
exports.allDoctors = catchAsync(async (req, res) => {
    const doctors=await Doctor.find();
    if(!doctors){
        return next(new AppError("sry for inconvience. Plz try again after some time",400))
    }
    res.status(200).json({
        status: "success",
        statusCode: 200,
        result:doctors
    });
});


// function to find only one  specific doctor
exports.findByName = catchAsync(async (req, res) => {
   
    const {name}=req.body;
    console.log(name)
    const doctor=await Doctor.find({name});
    if(!doctor){
        return next(new AppError(`there is no doctore with name ${name} in our Hospital`))
    }
    res.status(200).json({
        status: "success",
        statusCode: 200,
        result:doctor
    });
})

exports.getAllAppointment=catchAsync(async(req,res,next)=>{
    const id=req.User._id;
    const appointments=await Slot.find({doctorId:id,patientId:{$ne:null}});
    if(appointments.length===0 ){
        return res.status(200).json({
            status:"successfull",
            statusCode:200,
            message:"oh ho! there is no appintment for today",
            result:"none"
        });
    }
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        message:"Here all appointment for you",
        result:appointments

    });

})


// route handler to handle updation of Doctor
exports.updateDoctor = catchAsync(async (req, res,next) => {
    const doctor=await Doctor.find({name:req.body.name});
    if(!doctor){
        return next("doctor does't exist");
    }

    res.status(200).json({
        status: "success",
        statusCode: 200,
        result: "New doctor added successfully"
    });
});


exports.isAvailble=catchAsync(async(req,res,next)=>{
    if(req.User.isAvailble===true){
        return(
            res.status(200).json({
                status: "success",
                statusCode: 200,
                result: "Your Status is already Changed to available and already slots are created"
            })
        )
    }
    const isDoctorAvail=await Doctor.findByIdAndUpdate(req.User._id,{isAvailble:true});
    if(!isDoctorAvail){
        return next("There is an error!! plz try again later",500)
    }
    const doctorId=req.User._id;
    const startHour=req.body.startHour;
    const endHour=req.body.endHour;
    const breakHourStarts=req.body.breakhour;
    const slots=[];
    for(let hour=startHour;hour<endHour;hour++){
        if(hour===breakHourStarts){
            continue;
        }
        let startTime = new Date();
        let endTime = new Date();
        // startTime.setDate(startTime.getDate() + 1);
        // endTime.setDate(endTime.getDate() + 1);
        // startTime.setHours(hour, 0, 0, 0);
        // endTime.setHours(hour + 1, 0, 0, 0);
        // startTime = startTime.toLocaleString(undefined, { timeZone: "Asia/Kolkata", hour: "numeric", minute: "numeric", hour12: false });
        // endTime = endTime.toLocaleString(undefined, { timeZone: "Asia/Kolkata", hour: "numeric", minute: "numeric", hour12: false });
        const slot={
            startTime,
            endTime,
            doctorId,
            patientId:null,
        }
        slots.push(slot);
    }
    await Slot.insertMany(slots);
    res.status(200).json({
        status: "success",
        statusCode: 200,
        result: "Now your status is changed to availble for today and slots are created"
    });
})

// route to handle deleteion of existing doctor from data base
exports.deleteDoctor = catchAsync(async (req, res,next) => {
    console.log(req.body.email);
    const doctor=await Doctor.findOneAndUpdate({email:req.body.email},{active:false});
    console.log(doctor)
    
    res.status(200).json({
        status: "success",
        statusCode: 200,
        result: "Doctor Deleted successfully"
    });
});
