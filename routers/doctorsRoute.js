const express = require("express");
const firm=require("express-formidable")
const Auth=require("../controlles/doctorAuthenticate");
const reviewRoute=require("./reviewRoute");
const Doctor = require("../models/doctorModel")
const {showProfile}=require("../controlles/patientController");
const appointmentController =require("../controlles/appointmentController")
const { getAllDoctors, getMyProfile,updateDoctor, deleteDoctor,setData ,uploadImg} = require("../controlles/doctorController");

const router = express.Router();

router.get("/allAppointmentOfMine",Auth.protect,appointmentController.getAllAppointments)
router.get("/",Auth.protect, Auth.restrictTo("admin"),getAllDoctors);
router.post("/upload", firm(),uploadImg);

router.post("/signup",setData,Auth.signUp);
router.use("/:doctorId/reviews",reviewRoute)
router.post("/logIn", Auth.logIn);
router.patch("/updatePassword", Auth.protect, Auth.updatePassword)
router.get("/showOnePatient", Auth.protect, showProfile)

router.route("/:id")
    .get(Auth.protect,Auth.restrictTo("doctor"),getMyProfile)
    .patch(Auth.protect,Auth.restrictTo('doctor'),updateDoctor)
    .delete(Auth.protect,Auth.restrictTo("admin"),deleteDoctor);

module.exports = router;


