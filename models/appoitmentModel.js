const mongoose=require("mongoose");

const slotSchema=new mongoose.Schema({
    doctorId:{
        type:String
       
    },
    patientId:{
        type:String
       
    },
    bookedAt:{
        type:Date,
        default:Date.now()
    },
    slotTime:{
        // proper timing like 10:00-11:00
        type:Date,
    },
    
    
})
const Slot=mongoose.model("Slot",slotSchema);

module.exports=Slot;