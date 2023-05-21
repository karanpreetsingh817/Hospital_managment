const catchAsync = require("../utli/catchAsync");
const AppError = require("../utli/appError");
const Doctor = require("./../models/doctorModel");
const handlerFactory = require("./handlerFactory");
const cloudinary = require("cloudinary");
const Review = require("../models/reviewModel")
const mongoose = require("mongoose")
const Slot = require("../models/appoitmentModel")

exports.uploadImg = catchAsync(async (req, res, next) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    })
    console.log(req.files.profileImg.path)
    const result = await cloudinary.uploader.upload(req.files.profileImg.path);

    res.json({
        url: result.secure_url,
        public_id: result.public_id
    });


})


exports.setData = (req, res, next) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        experience: req.body.experience,
        specialization: req.body.specialization,
        description: req.body.description,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        qualification: req.body.qualification,
        profileImg: req.body.image,
        appointmentFee: req.body.appointmentFee
    }
    console.log("done")
    req.data = data;
    next()

}


/*  This route is called whenever Doctor want to
    View his Profile 
 */
exports.getMyProfile = catchAsync(async (req, res, next) => {
 const id=new mongoose.Types.ObjectId(req.params.id);
    const myDetail = await Doctor.findById(id);
    if (!myDetail) {
        return next(new AppError("Sry there is a problem !! PLZ try again Later"));
    }

    res.status(200).json({
        status: "successfull",
        statusCode: 200,
        result: myDetail
    })
});

/*   This route Handler is called when Admin wants to get detail 
    of all Registered Doctors.
*/
exports.getAllDoctors = catchAsync(async (req, res) => {
    const doctors = await Doctor.find();
    if (!doctors) {
        return next(new AppError("sry for inconvience. Plz try again after some time", 400))
    }
    res.status(200).json({
        status: "success",
        statusCode: 200,
        result: doctors
    });
});

/*  If doctor want to updation in his profile then
    THIS ROUTE  HANDLER is called .
*/
exports.updateDoctor = catchAsync(async (req, res, next) => {
    0
    const doctor = await Doctor.findById(req.User._id);
    if (!doctor) {
        return next("doctor does't exist", 404);
    }
    doctor.name = req.body.name || doctor.name;
    doctor.email = req.body.email || doctor.email;
    if (req.body.name) {
        res.cookie("username", req.body.name, {
            httpOnly: false,
            sameSite: false,

        })
    }
    await doctor.save({ validateBeforeSave: false });
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "DOctors details updated succssefully",
        result: doctor
    });
});

/*   If there is Doctor who left Our system then
     we can delete Doctors details and This function
     is called 
*/
exports.deleteOne=catchAsync(async (req, res,next) => {
    console.log(req.params.id)
    const document=await Doctor.findByIdAndUpdate(req.params.id,{active:false});
    res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Document Deleted successfully",
        result:document
    });
})


/*  If patient want to search Doctors 
    details by just Entering by Doctors details.
*/

exports.getDoctorByName = catchAsync(async (req, res, next) => {
    const { name } = req.query;
    const doctor = await Doctor.findOne({ name });
    if (!doctor) {
        return next(new AppError(404, `there is no doctore with name ${name} in our Hospital`))
    }
    res.status(200).json({
        status: "success",
        statusCode: 200,
        result: doctor
    });
})


/*  This Route is Called  when patient is trying to 
    Book appointment  and this Route controller is
    just show all Dopctor who are availble at that date
*/
exports.getTodayAvailbleDoctors = catchAsync(async (req, res, next) => {
    const doctor = await Doctor.find();
    if (!doctor) {
        return next(new AppError(400, "Sry there is no Doctor availabe today "));
    }
    res.status(200).json({
        status: "success",
        message: "There is details of Todays doctor",
        statusCode: 200,
        result: doctor
    });
});



exports.getDoctorProfile = catchAsync(async (req, res, next) => {

    const id = new mongoose.Types.ObjectId(req.params.doctorId)
    const filter = { doctorId: id };

    const doctorDetails = await Doctor.findById(req.params.doctorId);
    const review = await Review.find(filter);
    if (!doctorDetails) {
        return next(new AppError("Sry there is a problem !! PLZ try again Later"));
    }
    res.status(200).json({
        status: "successfull",
        statusCode: 200,
        result: doctorDetails,
        review
    })
});



exports.getData = catchAsync(async (req, res, next) => {
    let date = new Date();
    let day = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear();
    const timing = `${day}/${month}/${year}`;
    const appointments = await Slot.find({ doctorId: req.User._id, patientId: { $ne: null } });
    const todayAppointments = await Slot.find({ doctorId: req.User._id, patientId: { $ne: null }, timing: timing });
    let patients = await Slot.aggregate([
        { $match: { doctorId: req.User._id } },
        {
            $group: {
                _id: '$patientId',
            }
        },
        { $match: { _id: { $ne: null } } }

    ]).exec();
    const todayCollection = (req.User.appointmentFee) * (todayAppointments.length);
    const totalPatient = patients.length;
    const totalCollection = (req.User.appointmentFee) * (appointments.length);

    res.status(200).json({
        status: "successfull",
        statusCode: 200,
        message: "Appointment Updated successFully",
        result: {
            appointments,
            todayAppointments,
            todayCollection,
            totalPatient,
            totalCollection
        }
    })
})

