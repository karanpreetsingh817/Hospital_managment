const mongoose=require("mongoose");


const ticketSchema=new mongoose.Schema({
    userName:{
        type:String
    },
    issue:{
        type:String,
        required:[true,"Must Elaborate Issue You Face"]
    },
    ticketNumber:{
        type:Number
    },
    email:{
        type:String
    },
    genratedAt:{
        type:Date,
        default: Date.now()
    },
    id:{
        type : mongoose.Schema.ObjectId
    },
    role:{
        type:String
    },
    status:{
        type: String,
        default:"open"
    }
})

const Ticket=mongoose.model("Ticket",ticketSchema);
module.exports=Ticket;