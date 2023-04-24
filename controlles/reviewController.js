const catchAsync=require("./../utli/catchAsync");
const Review=require("./../models/reviewModel");
const AppError=require("./../utli/appError");

exports.getAllReview=catchAsync(async(req,res,next)=>{
    let filter={};
    if(req.params.doctorId) filter={doctorId:req.params.doctorId} ;
    const reviews=await Review.find(filter);
    if(!reviews){
        return next(new AppError(500,"There is a problem while Fetching the reviews at a Time! PLZ try again later"));
    }
res.status(200).json({
    status:"Successfull",
    statusCode:200,
    message:"Here all reviews",
    result:reviews
})
});

exports.postReview=catchAsync(async(req,res,next)=>{
    if(!req.body.doctorId) req.body.doctorId=req.params.doctorId;
    if(!req.body.patientId) req.body.patientId=req.User._id;
    const newReview=await Review.create(req.body);
    if(!newReview){
        return next(new AppError(500," Sry for inconvience!! Create review after some time"))
    }
    res.status(200).json({
        status:"Successfull",
        statusCode:200,
        message:"you successfully revied",
        result:newReview
    })
})

exports.deleteReview=catchAsync(async(req,res,next)=>{
    if(!req.body.doctorId) req.body.doctorId=req.params.doctorId;
    if(!req.body.patientId) req.body.patientId=req.User._id;
    const review= await Review.findOneAndUpdate({doctorId:req.body.doctorId,patientId:req.body.patientId},{isDelete:true});
    if(!review){
        return(next(new AppError(400,"Your request to delete Review failed at this moment!!! Plz try again after someTime")))
    }
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Review Deleted successfully",
        result:"Done"
    });
})