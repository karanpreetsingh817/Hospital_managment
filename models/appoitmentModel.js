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
        type:String
    },
    timeStamp:{
        type:Number
    },
    appointmentStatus:{
        type: String,
        enum: ['empty', 'pending', 'fullfill',"cancle"],
        default:'empty'
    },
    status: {
        type: String,
        enum: ['done', 'cancled', 'upcoming'],
        default:'upcoming'
    }   
});

slotSchema.pre('findMany', function(next) {
    this.find({ patientId: { $ne: null } }); 
    next();
});

slotSchema.pre('findOne', function(next) {
    this.find({ patientId: { $ne: null } }); 
    next();
});

slotSchema.pre("find", function(next){
    this.find({ patientId: { $ne: null } }); 
    next();
});

const Slot=mongoose.model("Slot",slotSchema);

module.exports=Slot;