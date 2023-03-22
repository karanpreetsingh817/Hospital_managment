const mongoose=require("mongoose");

const patientSchema=new mongoose.Schema({
    name:{
        type:String,
        require:[true,"must enter your name"]
    },
    age:{
        type:Number,
        require:true
    },
    address:String,
    bloodGroup:{
        type:String,
        require:[true,"You must tell your bloodGroup for Doctors ease"] 
    },
    phoneNumber:{
        type:Number,
        require:[true,"Plz provide your contract number"],

    },
    patientId:{
        type:string
    },
    Status:{
        type:Boolean,
        default:true
    },
    medicines:[string],
    reports:{
        type:[String] ,

    },
    email:{
        type:String,
        trim:true         
    },
    password:{
        type:String,
        trim:true,
        require:[true,"must enter strong password"]
    },
    photo:{
        type:String
    }

});

const Patients=mongoose.model("Patients",patientSchema);
module.exports=Patients;