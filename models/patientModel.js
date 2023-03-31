const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const patientSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, "must enter your name"],
  },
  age:{
    type: Number,
    required: true,
  },
  address:{
    type: String
  },
  bloodGroup:{
    type: String,
    required: [true, "You must tell your bloodGroup for Doctors ease"],
  },
  phoneNumber:{
    type: Number,
    required: [true, "Plz provide your contract number"],
  },
  Status:{
    type: Boolean,
    default: true,
  },
  medicines: {
    type:[String]
  },
  reports:{
    type: String,
  },
  email: {
    type: String,
    trim: true,
    unique:[true,"email is already exists"],
    required:[true,"plz provide e-mail"]
  },
  password:{
    type: String,
    trim: true,
    required: [true, "must enter strong password"],
  },
  confirmPassword:{
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (el) {
        return el == this.password;
      },
    },
    message: "Plz enter same password",
  },
  photo: {
    type: String,
  },
});

// here we use hash and store hash of our password into data base 
patientSchema.pre("save", async function (next) {
  if (!this.isModified("password")){
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// here we define a function which is applicable for all documents to check whether password enter by user is currect or not
patientSchema.methods.correctUser=async(candidatePassword,userPassword)=>{
    return await bcrypt.compare(candidatePassword,userPassword);
}

const Patients = mongoose.model("Patients", patientSchema);
module.exports = Patients;
