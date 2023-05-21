const catchAsync=require("./../utli/catchAsync");

exports.deleteOne=(model)=>catchAsync(async (req, res,next) => {
    const document=await model.findByIdAndUpdate(req.User._id,{active:false});
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Document Deleted successfully",
        result:document
    });
})



