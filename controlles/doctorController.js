const AppError = require("../utli/appError");
const catchAsync = require("../utli/catchAsync");
const Doctor=require("./../models/doctorModel");
const Slot=require("./../models/appoitmentModel");
const Patient=require("./../models/patientModel");


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
});

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
        return next(new AppError("There is an error!! plz try again later",500)) 
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
});


exports.showAllConfirmedAppointment=catchAsync(async(req,res,next)=>{
    const appointments= await Slot.find({appointmentStatus:'fullfill',doctorId:req.User._id});
    // send Erorr
    if(!appointments){
        return next(new AppError("There is problem while fetching Confirmed Appointsment",400));
    }
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        message:"Here all confirmed appointments of yours",
        result:appointments
    })  
});

exports.showAllPendingAppointment=catchAsync(async(req,res,next)=>{
    const appointments= await Slot.find({appointmentStatus:'pending',doctorId:req.User._id});
    // send Erorr
    if(!appointments){
        return next(new AppError("There is problem while fetching Pending Appointsment",400));
    }
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        message:"Here all Pending appointments of yours",
        result:appointments
    })  
});

exports.approvedAppointment=catchAsync(async(req,res,next)=>{
    const appointment=await findOneAndUpdate({startTime:req.body.startTime},{appointmentStatus:"fullfill"});
    if(!appointment){
        return next(new AppError("sorry for problem you are facing right now! appointment is not confirmedd right-now Plz try again ",500))
    }
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        message:"Appointment is confirmed",
        result:appointment
    }) 
})

exports.cancleAppointment=catchAsync(async(req,res,next)=>{
    const appointment=await findOneAndUpdate({startTime:req.body.startTime},{appointmentStatus:"empty",patientid:null});
    if(!appointment){
        return next(new AppError("sorry for problem you are facing right now! appointment is not Canclled right-now Plz try again ",500))
    }
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        message:"Appointment is Canclled successfully",
        result:appointment
    }) 
})


exports.addReport=catchAsync(async(req,res,next)=>{
    const patient=await Patient.find({name:req.body.name});
    const newReport= await reportError.Create({
        name:req.body.reportName,
        description:req.body.description,
        img:req.body.img,
        consultedBy:req.User.name,
        medicine:req.body.medicines  // gwt mwdicine from doctor
    })
    result=patient.reports.push(newReport);
    await patient.save();
    if(!result){
        return (next (new AppError("there is a problem!! report is not saved Plz try again later",500)));
    }
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        message:"new report of patient is added",
        result
    })
})


exports.showAllreports=catchAsync(async(req,res,next)=>{
    const id=req.body.id;
    const patient= await Patient.findById(id);
    const reports = await Child.find({ _id: { $in: parent.children } });
    
    if(!reports){
        return next(new AppError("Ther is a problem while fetching reports of patient kindly try again later",400))
    }
    res.status(200).json({
        status:"successfull",
        statusCode:"200",
        message:"here all reports of patient",
        result:reports
    })
})