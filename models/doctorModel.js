const mongoose = require("mongoose");

// here we define svhema for doctor
const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        require: [true, "you must enter detail "],
        trim: true
    },
    age: {
        type: Number,
    },
    experience: {
        type: String,
        require: [true, "doctor must update your experience"],
        trim: true
    },
    specialization: {
        type: String,
        require: [true, "Dr. must tell their specialization field so that petient can easily contract"],
    },
    description: {
        type: String,
        trim: true
    },
    dateOfCreation: {
        type: Date,
        default: Date.now(),
        select: false
    },
    profileImg: {
        type: String,
        require: true,
        trim: true
    },
    role:{
        type:String,
        default:"doctor"
    },
    appointmentFee: {
        type: Number,
        required: [true, 'Must add your Appointment Fee'],
    }
});

// Create model named as Doctor from doctorSchema
const Doctors = mongoose.model("Doctors", doctorSchema);

module.exports = Doctors;