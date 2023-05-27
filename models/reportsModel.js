const mongoose=require("mongoose");

const reportSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Plz give a name for Reoprt"]
    },
    description:{
        type:String
    },
    dateOfCreation:{
        type:Date,
        default:Date.now
    },
    image:{
        url:String,
        public_id: String,
        // required:[true,"Plz update reports Image so that in future it can used"]
    },
    consultedBy:{
        typr:String  
    },
    medicine:{
        type:String,
        require:[true,"Plz update medicines here so that patient can chgeck their medicines name from any where and at any time"]
    }, 
    patientId:{
        type:mongoose.Schema.ObjectId,
        ref:"Patient"
    }
});

const Report=mongoose.model("Report",reportSchema);
module.exports=Report;