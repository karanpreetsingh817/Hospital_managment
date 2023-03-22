const mongoose=require("mongoose");


const doctorSchema= new mongoose.Schema({
    name:{
        type:String,
        require:[true,"you must enter detail "],
        trim:true
        },
        age:{
            type:Number,
            require:true
        },
        experience:{
            type:String,
            require:[true,"doctor must update your experience"],
            trim:true
        },
        specialization:{
            type:String,
            require:[true,"Dr. must tell their specialization field so that petient can easily contract"],
        },
        description:{
            type:String,
            trim:true
        },
        dateOfCreation: {
            type: Date,
            default: Date.now(),
            select:false
    
        },
        coverImg: {
            type: String,
            require: true,
            trim: true
        },
        appointmentFee: {
            type: Number,
            required: [true, 'Must add your Appointment Fee'],
    
        }

});
const Doctors=mongoose.model("Doctors",doctorSchema);

module.exports=Doctors;