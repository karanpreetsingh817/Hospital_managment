const mongoose=require("mongoose");

const reviewSchema=new mongoose.Schema({
    review:{
        type:String,
        required:[true,"review cant be empty"]
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    isDelete:{
        type:Boolean,
        default:false

    },
    patientId:{
        type:mongoose.Schema.ObjectId,
        ref:"Patient",
        required:[true,"Review Must Belongs To Patient "]
    },
    doctorId:{
        type:mongoose.Schema.ObjectId,
        ref:"Doctor",
        required:[true,"Review Must Belong To Doctor"]
    },
   
},
{
    toJSON:{ virtuals:true},
    toObject:{virtuals:true }
});

reviewSchema.pre(/^find/, function(next){
    this.populate({
        path:"doctorId",
        select:"name"
    }).populate({
        path:"patientId",
        select:"name"
    });
    next()
});


const Review=mongoose.model("Review",reviewSchema);

module.exports=Review;
