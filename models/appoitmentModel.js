const mongoose=require("mongoose");


const slotSchema=new mongoose.Schema({
    doctorId:{
        type:mongoose.Schema.ObjectId,
        ref:'Doctor'
    },
    patientId:{
        type:mongoose.Schema.ObjectId,
        ref:'Patient'
       
    },
    bookedAt:{
        type:Date,
        default:Date.now()
    },
    startTime:{
        type:Date,
    },
    endTime:{
        type:Date
    },
    appointmentStatus: {
        type: String,
        enum: ['empty', 'pending', 'fullfill'],
        default:'empty'
      }
    
})
const Slot=mongoose.model("Slot",slotSchema);

module.exports=Slot;