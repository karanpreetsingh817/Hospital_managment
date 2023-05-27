const catchAsync = require("./../utli/catchAsync");
const Review = require("./../models/reviewModel");
const AppError = require("./../utli/appError");
const mongoose = require("mongoose")

exports.getAllReview = catchAsync(async (req, res, next) => {
   
        let filter = {};
        if (req.params.doctorId) { 
            const id = new mongoose.Types.ObjectId(req.params.doctorId)
            if (mongoose.Types.ObjectId.isValid(req.params.doctorId)) {
                filter = { doctorId: id };
            } else {
                return next(new AppError(400, 'Invalid doctorId parameter'));
            }
        }
        
        const reviews = await Review.find(filter);
        
        if (!reviews || reviews.length === 0) {
            return next(new AppError(404, 'No reviews found'));
        }
        
        res.status(200).json({
            status: 'success',
            message: 'Here are all the reviews',
            result: reviews
        });
   
});


exports.deleteReview = catchAsync(async (req, res, next) => {
    if (!req.body.doctorId) {
        req.body.doctorId = req.params.doctorId;
        const objectId = new mongoose.Types.ObjectId(req.params.doctorId);
        req.body.doctorId = objectId;
    }
    if (!req.body.patientId) req.body.patientId = req.User._id;
    const review = await Review.findOneAndUpdate({ doctorId: req.body.doctorId, patientId: req.body.patientId }, { isDelete: true });
    if (!review) {
        return (next(new AppError(400, "Your request to delete Review failed at this moment!!! Plz try again after someTime")))
    }
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Review Deleted successfully",
        result: review
    });
})
exports.postReview = catchAsync(async (req, res, next) => {
   
    if (req.body.isThere) {
        const review = await Review.findOneAndUpdate({ doctorId: req.body.doctorId, patientId: req.body.patientId }, { review: req.body.review, rating: req.body.rating });
        console.log(review)
        return(
    
        res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "Review Updated successfully",
            result: review
        }));
    }
    else {

        const newReview = await Review.create(req.body);
        if (!newReview) {
            return next(new AppError(500, " Sry for inconvience!! Create review after some time"))
           
        }
        res.status(200).json({
            status: "Successfull",
            statusCode: 200,
            message: "you successfully revied",
            result: newReview
        })

    }
})

exports.isThereReview = catchAsync(async (req, res, next) => {
    req.body.rating = 1 * (req.body.rating);
    if (!req.body.doctorId) {
        req.body.doctorId = req.params.doctorId;
        const objectId = new mongoose.Types.ObjectId(req.params.doctorId);
        req.body.doctorId = objectId;
    }
    if (!req.body.patientId) req.body.patientId = req.User._id;
    const review = await Review.findOne({ doctorId: req.body.doctorId, patientId: req.body.patientId });
    if (review) {
        req.body.isThere = true;
    }
    next()

})


exports.getMyReview = catchAsync(async (req, res, next) => {
   
    let filter = {};
    if (req.params.doctorId) { 
        const id = new mongoose.Types.ObjectId(req.params.doctorId)
        if (mongoose.Types.ObjectId.isValid(req.params.doctorId)) {
            filter = { doctorId: id ,patientId:req.User._id};
        } else {
            return next(new AppError(400, 'Invalid doctorId parameter'));
        }
    }
    
    const reviews = await Review.find(filter);
    
    if (!reviews || reviews.length === 0) {
        return next(new AppError(404, 'No reviews found'));
    }
    
    res.status(200).json({
        status: 'success',
        message: 'Here are all the reviews',
        result: reviews[0]
    });

});
