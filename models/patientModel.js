const mongoose=require("mongoose");
const bcrypt=require("bcryptjs")

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
    
    Status:{
        type:Boolean,
        default:true
    },
    medicines:[String],
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
    confirmPassword:{
        type:String,
        require:true,
        trim:true,
        validate:{
        validator: function(el){
            // this is only applicale on Create and Save methods in mongoose not in findAndUpdate
           return el==this.password

        }
    },
        message:"Plz enter same password"
        
        
        
    },
    photo:{
        type:String
    }

});
patientSchema.pre('save',async function (next){
    if(!this.isModified('password')){
        return next();
    
        
    }
   
    this.password= await bcrypt.hash(this.password,18);
    this.confirmPassword=undefined;
    next();
    



});

const Patients=mongoose.model("Patients",patientSchema);
module.exports=Patients;