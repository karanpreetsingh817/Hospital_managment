const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "must enter your name"],
  },
  age: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
  },
  bloodGroup: {
    type: String,
    required: [true, "You must tell your bloodGroup for Doctors ease"],
  },
  phoneNumber: {
    type: Number,
    required: [true, "Plz provide your contract number"],
  },
  Status: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    default: "user"

  },
  medicines: {
    type: [String],
  },
  reports: {
    type: String,
  },
  email: {
    type: String,
    trim: true,
    unique: [true, "email is already exists"],
    required: [true, "plz provide e-mail"],
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
  },
  photo: {
    type: String,
  }
});

// here we use hash and store hash of our password into data base
patientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
patientSchema.pre("save",function(next){
  if(!this.isModified("password")||this.isNew) return next()

  this.passwordChangeAt=Date.now()-1000;
  next();
})


// here we define a function which is applicable for all documents to check whether password enter by user is currect or not
patientSchema.methods.correctUser = async function (candidatePassword, userPassword) {
  await bcrypt.compare(candidatePassword, userPassword);
}

// Here we check whether password is changed  or not after token is issued
patientSchema.methods.validatePass = function (tokenIssueDate) {
  if (this.passwordChangeAt) {
    const changeAt = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
    return tokenIssueDate < changeAt
  }
  return false;
};

// Create function to create reset password string
patientSchema.methods.createPassResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

  this.passwordResetExpires=Date.now()+ 10*60*1000;  //means password reset token expire automatically after 10 minute


  return resetToken;
}

// here we create a new model name patients using patientSchema
const Patients = mongoose.model("Patients", patientSchema);

module.exports = Patients;
