const AppError = require("../utli/appError");
const catchAsync = require("../utli/catchAsync");
const Doctor=require("../models/doctorModel");
const Patient=require("./../models/patientModel");
const Slot=require("../models/appoitmentModel");

/*  this is router controle to create slots of Appointment.Once doctor confirm that he 
    is available for next day or a particular day then this controller is called.Whenever 
    this Controller is called, it means Doctor confirm the Availability for particular day 
    and Slots Created with patienId null.BuT for now I just Make the SLot duration equly for 
    One Hour.
 */
exports.postSlots=catchAsync(async(req,res,next)=>{
     
    const isDoctorAvail=await Doctor.findByIdAndUpdate(req.User._id,{isAvailble:true});
    if(!isDoctorAvail){
        return next(new AppError(500,"There is an error!! plz try again later")) 
    }
    const doctorId=req.User._id;
    const startHour=req.body.startHour;
    const endHour=req.body.endHour;
    const breakHourStarts=req.body.breakHour;
    const day=req.body.day;
    const month=req.body.month;
    const year=req.body.year;
    const slots=[];
    for(let hour=startHour;hour+1<=endHour;hour++){
        if(hour===breakHourStarts){
            continue;
        }
        let startTime = new Date(year,month-1,day,hour,0,0);
        startTime=startTime.getTime();
        
        const slot={
            startTime:`${day}-${month}-${year} time:${hour}:00-${hour+1}:00`,
            doctorId:doctorId,
            timeStamp:startTime,
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

/* One doctor Confirm the Availibity and Slots are Created then
   Patient can Book appointment with Thier preffered Time slot.We
   Just take the patientId and put that id Into slots patientId field.
   const specificTime = new Date(2023, 3, 23, 18, 43, 0); // May 23, 2023 at 6:31:00 PM
*/
exports.bookAppointment=catchAsync(async(req,res,next)=>{
    const hour=req.body.startHour;
    const day=req.body.day;
    const month=req.body.month;
    const year=req.body.year;
    let startTime=new Date(year,month-1,day,hour,0,0);
    startTime=startTime.getTime();
    const doctorId=req.body.doctorId;
    const id=req.User._id;
    const appointment=await Slot.findOneAndUpdate({doctorId:doctorId,timeStamp:startTime,patientId:null},{patientId:id,appointmentStatus:'pending'});
    if(!appointment){
        return next (new AppError(500,"Sry for incovinence!!! you are not able to make appointment at this momment"))
    }
    res.status(200).json({
        status:"success",
        message:"Your request for appointment is being under prrocess",
        result:appointment 
    });
});

/*  Once patient Book appointment, then Doctor can view that how much appointments
    are already booked and like stuff
*/
exports.getAllAppointments=catchAsync(async(req,res,next)=>{
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
});

// /*  All appointments that are requested by Patient must be confirmed by 
//     doctor. Once Doctor confirm the req for appointment it Means  appointment 
//     is confirmed.
// */
// exports.getConfirmedAppointment=catchAsync(async(req,res,next)=>{
//     const appointments= await Slot.find({appointmentStatus:'fullfill',doctorId:req.User._id});
//     // send Erorr
//     if(!appointments){
//         return next(new AppError("There is problem while fetching Confirmed Appointsment",400));
//     }
//     res.status(200).json({
//         status:"successfull",
//         statusCode:200,
//         message:"Here all confirmed appointments of yours",
//         result:appointments
//     })  
// });

// /*  All appointment Request without Doctor's confirmation is Under Pendding
//     appointments.These appointments are Not confirmed yet.Once it Confirmed 
//     By Doctor Then Status will be changed into Confirmed Appointment
// */
// exports.getPendingAppointment=catchAsync(async(req,res,next)=>{
//     const appointments= await Slot.find({appointmentStatus:'pending',doctorId:req.User._id});
//     if(!appointments){
//         return next(new AppError("There is problem while fetching Pending Appointsment",400));
//     }
//     res.status(200).json({
//         status:"successfull",
//         statusCode:200,
//         message:"Here all Pending appointments of yours",
//         result:appointments
//     })  
// });

// /*  If appointment in pendding state then This controller is called by Doctor 
//     to conFirm that appointment and change status to Confirmd appointment
// */
// exports.approveAppointment=catchAsync(async(req,res,next)=>{
//     const appointment=await findOneAndUpdate({startTime:req.body.startTime},{appointmentStatus:"fullfill"});
//     if(!appointment){
//         return next(new AppError("sorry for problem you are facing right now! appointment is not confirmedd right-now Plz try again ",500))
//     }
//     res.status(200).json({
//         status:"successfull",
//         statusCode:200,
//         message:"Appointment is confirmed",
//         result:appointment
//     }) 
// });

/*  if for any rreason Doctor is not able to take Patient consultant 
    then Doctor can Cancle the Appointment Just Searching By Time slot.
*/
exports.cancleAppointment=catchAsync(async(req,res,next)=>{
    const appointment=await Slot.findOneAndUpdate({timeStamp:req.body.timeStamp,status:"upcoming"},{status:"cancle",patientId:null});
    if(!appointment){
        return next(new AppError(500,"sorry for problem you are facing right now! appointment is not Canclled right-now Plz try again "))
    }
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        message:"Appointment is Canclled successfully",
        result:appointment
    }) 
});

/* 
    Suppose dr. cancle the appointment firts and then realize that
    he can attend that slot, In this case dr. can call this Function 
    and make slot available for Booking
*/
exports.reOpenAppointment=catchAsync(async(req,res,next)=>{
    const appointment=await findOneAndUpdate({startTime:req.body.startTime},{appointmentStatus:"empty"});
    if(!appointment){
        return next(new AppError(500,"sorry for problem you are facing right now! appointment is not Canclled right-now Plz try again "))
    }
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        message:"Appointment is Canclled successfully",
        result:appointment
    }) 
});


exports.getAllDoneAppointment=catchAsync(async(req,res,next)=>{ 
    let filter={}
    if(req.User.role==="user"){
        filter={
            patientId:req.User._id,
            status:"done"
        }
    }
    else{
        filter={
            doctorId:req.User._id,
            status:"done"
        }
    }

    const appointments=await Slot.find(filter);
    if(!appointments){
        return next(new AppError(500,"sorry for problem you are facing right now!  Plz try again "))
    }
    res.status(200).json({
        status:"successfull",
        statusCode:200, 
        message:"All apointments That you are attend is Here",
        result:appointments
    }) 
})


exports.restrictTo=(...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.User.role)) {
            return next(new AppError(403, "You are not Allow to do This action"));
        }
        next();
    };
};

exports.getAllUpcomingAppointment=catchAsync(async(req,res,next)=>{ 
    let filter={}
    if(req.User.role==="user"){
        if(req.body.date){
            const date=req.body.date
            let timeStamp=new Date(date.year,date.month -1, date.day,23,0,0)
            timeStamp=timeStamp.getTime();
            filter={
                patientId:req.User._id,
                status:"upcoming",
                timeStamp:{$le:timeStamp}
            }
        }
        filter={
            patientId:req.User._id,
            status:"upcoming"    
        }
    }
    else{
        if(req.body.date){
            const date=req.body.date
            let timeStamp=new Date(date.year,date.month -1, date.day,23,0,0)
            timeStamp=timeStamp.getTime();
            filter={
                doctorId:req.User._id,
                status:"upcoming",
                timeStamp:{$le:timeStamp}
            }
        }
        filter={
            doctorId:req.User._id,
            status:"upcoming"
        }
    }
    const appointments=await Slot.find(filter);
    if(!appointments){
        return next(new AppError(500,"sorry for problem you are facing right now!  Plz try again "))
    }
    res.status(200).json({
        status:"successfull",
        statusCode:200, 
        message:"All apointments That you are attend is Here",
        result:appointments
    })
})


exports.getAppointmentByName=catchAsync(async(req,res,next)=>{
    if(!req.body.name){
        return next(new AppError("Plz Enter Patient Name",400))
    }
    const patient=await Patient.find({name:req.body.name});
    if(!patient){
        return next(new AppError( 500,"There is no patient By this name in our system"))
    }
    const patientId=patient._id;
    const appointment=await Slot.find({patientId:patientId,doctorId:req.User._id});
    if(!appointment){
        return next(new AppError( 400,"There is no Apponintment of this patient in our dataBase"))
    }
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        message:"Response will contain all details of appointment of this patient",
        result:appointment
    })
})


exports.doneAppointment=catchAsync(async(req,res,next)=>{
    const appointment=await Slot.findOneAndUpdate({_id:req.body.id,status:"upcoming"},{status:"done"});
    if(!appointment){
        return next(new AppError( 400,"There is problem while Updating the Status of Apponintment ! plz try after some time"))
    }
    res.status(200).json({
        status:"successfull",
        statusCode:200,
        message:"Appointment Updated successFully",
        result:appointment
    })
})
