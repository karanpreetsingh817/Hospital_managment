const mongoose=require("mongoose");

const slotSchema=new mongoose.Schema({
    doctorId:{
        type:mongoose.Schema.objectId,
        ref:Doctor
       
    },
    patientId:{
        type:mongoose.Schema.objectId,
        ref:Patient
       
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
    }
    
    
})
const Slot=mongoose.model("Slot",slotSchema);

module.exports=Slot;