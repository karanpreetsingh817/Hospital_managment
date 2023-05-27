const express = require("express");
const firm=require("express-formidable")
const Auth=require("../controlles/doctorAuthenticate");
const reviewRoute=require("./reviewRoute");
const {getAllTicket,postTicket}=require("../controlles/ticketController")
const {showProfile,getPatientByName,deleteOn}=require("../controlles/patientController");
const appointmentController =require("../controlles/appointmentController")
const { getAllDoctors, getMyProfile,updateDoctor, deleteOne,setData ,uploadImg,getData, updateDoc,updatePat,getDoctorProfile} = require("../controlles/doctorController");

const router = express.Router();
router.get("/allAppointmentOfMine",Auth.protect,appointmentController.getAllAppointments)
router.get("/",Auth.protect, Auth.restrictTo("admin"),getAllDoctors);
router.post("/upload", firm(),uploadImg);
router.get("/showOnePatient",Auth.protect , showProfile);
router.get("/afterLogin",Auth.protect , getData)
router.get("/getPatientByName",Auth.protect ,getPatientByName );
router.post("/signup",setData,Auth.signUp);
router.get("/admin/:doctorId",getDoctorProfile)
router.get("/getTickets", Auth.protect, Auth.restrictTo("admin"),getAllTicket)

router.post("/postTicket",Auth.protect, Auth.restrictTo("admin"),postTicket)
router.post("/sendOtp",Auth.sendOtp)
router.patch("/resetPass", Auth.resetPassword)
router.patch("/forgetPassword", Auth.forgetPassword);
router.post("/logIn", Auth.logIn);
router.patch("/updatePassword", Auth.protect, Auth.updatePassword)
router.patch("/updateDoctor", Auth.protect,Auth.restrictTo("admin"), updateDoc)
router.patch("/updatePatient", Auth.protect,Auth.restrictTo("admin"), updatePat)
router.use("/:doctorId/reviews",reviewRoute)
router.delete("/deleteOne/:id",Auth.protect, Auth.restrictTo("admin") ,deleteOn)

router.route("/:id")
    .get(Auth.protect,Auth.restrictTo("doctor","admin"),getMyProfile)
    .patch(Auth.protect,Auth.restrictTo('doctor',"admin"),updateDoctor)
    .delete(Auth.protect,Auth.restrictTo("admin"),deleteOne);

module.exports = router;


