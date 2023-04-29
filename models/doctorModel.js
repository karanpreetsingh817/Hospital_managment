const mongoose = require("mongoose");
const bcrypt=require("bcryptjs");
const crypto = require("crypto");

// here we define svhema for doctor
const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        // unique: true,
        required: [true, "you must enter detail "],
        trim: true
    },
    email:{
        type: String,
        trim: true,
        unique: [true, "email is already exists"],
        required: [true, "plz provide e-mail"],
    },
    age: {
        type: Number,
    },
    experience: {
        type: String,
        required: [true, "doctor must update your experience"],
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
        // require: true,
        // trim: true
    },
    role:{
        type:String,
        default:"doctor"
    },
    appointmentFee: {
        type: Number,
        // required: [true, 'Must add your Appointment Fee'],
    },
    active: {
        type: Boolean,
        default: true,
        select:false
    },
    isAvailble:{
        type:Boolean,
        default:false
    },
    password: {
        type: String,
        trim: true,
        required: [true, "must enter strong password"],
    },
    confirmPassword: {
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
    passwordResetToken: {
        type: String
    },
    passwordChangeAt: {
        type: Date
    },
    passwordResetExpires: {
        type: Date
    }   
},
{
    toJSON:{ virtuals:true},
    toObject:{virtuals:true }
});

doctorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

doctorSchema.pre("save",function(next){
    if(!this.isModified("password")||this.isNew) return next()
    this.passwordChangeAt=Date.now()-1000;
    next();
});

doctorSchema.pre(/^find/, function(next){
    this.find({active:true});
    next();
  });

doctorSchema.virtual("reviews",{
    ref:'Review',
    foreignField:'doctorId',
    localField:'_id'
});

// here we define a function which is applicable for all documents to check whether password enter by user is currect or not
doctorSchema.methods.correctUser = async function (candidatePassword, userPassword) {
    return  await bcrypt.compare(candidatePassword, userPassword);
}
   
// Here we check whether password is changed  or not after token is issued
doctorSchema.methods.validatePass = function (tokenIssueDate) {
    if (this.passwordChangeAt) {
        const changeAt = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
        return tokenIssueDate < changeAt
    }
    return false;
   };
   
// Create function to create reset password string
doctorSchema.methods.createPassResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")
    this.passwordResetExpires=Date.now()+ 10*60*1000;  //means password reset token expire automatically after 10 minute
    return resetToken;
}
   
// Create model named as Doctor from doctorSchema
const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;