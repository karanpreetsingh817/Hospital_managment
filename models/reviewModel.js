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
    patient:{
        type:mongoose.Schema.ObjectId,
        ref:"Patient",
        required:[true,"Review Must Belongs To Patient "]
    },
    doctor:{
        type:mongoose.Schema.ObjectId,
        ref:"Doctor",
        required:[true,"Review Must Belong To Doctor"]
    },
    toJSON:{virtuals:true},
    toObject:{viurtuals:true }
});

const Review=mongoose.model("Review",reviewSchema);
