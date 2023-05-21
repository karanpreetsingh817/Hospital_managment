const express=require("express");
const authFactory=require("./../controlles/authFactory");
const Doctor=require("./../models/doctorModel");
const Patient=require("./../models/patientModel");
const appointmentController=require("./../controlles/appointmentController");

const router=express.Router();


router.post("/createSlots",authFactory.protect(Doctor),appointmentController.restrictTo("doctor"),appointmentController.postSlots);


router.get("/allAppointmentOfMine",authFactory.protect(Doctor),appointmentController.getAllAppointments)
router.get("/allAppointmentOfMin",authFactory.protect(Patient),appointmentController.getAllAppointment)

router.get("/",authFactory.protect(Doctor),appointmentController.allAppointment)


router.get("/mineDoctor",authFactory.protect(Patient),appointmentController.mineDoctors)
router.get("/minePatient",authFactory.protect(Doctor),appointmentController.minePatient)

router.get("/byDate",authFactory.protect(Patient),appointmentController.getAppointmentByDate)
router.get("/isCreated",authFactory.protect(Doctor),appointmentController.isCreated)

router.patch("/bookAppointment",authFactory.protect(Patient),appointmentController.bookAppointment);
router.patch("/cancleAppointment",authFactory.protect(Doctor),appointmentController.restrictTo("doctor"),appointmentController.cancleAppointment);
router.patch("/cancleAppointmentP",authFactory.protect(Patient),appointmentController.cancleAppointment);
router.patch("/makeAppointmentDone",authFactory.protect(Doctor),appointmentController.restrictTo("doctor"),appointmentController.doneAppointment);

router.get("/findByPatientName",authFactory.protect(Doctor),appointmentController.restrictTo("doctor"),appointmentController.getAppointmentByName);

module.exports=router

// router.patch("/makeSlotEmpty",authFactory.protect(Doctor),appointmentController.restrictTo("doctor"),appointmentController.reOpenAppointment)
// router.get("/byDate",appointmentController.getAppointmentByDate)
// router.get("/upComingAppointments",authFactory.protect(Doctor),appointmentController.restrictTo("doctor"),appointmentController.getAllUpcomingAppointment)
// router.get("/allAttendAppointments",authFactory.protect(Doctor),appointmentController.restrictTo("doctor"),appointmentController.getAllDoneAppointment);
