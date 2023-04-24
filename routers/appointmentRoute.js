const express=require("express");
const authFactory=require("./../controlles/authFactory");
const Doctor=require("./../models/doctorModel");
const Patient=require("./../models/patientModel");
const appointmentController=require("./../controlles/appointmentController");

const router=express.Router();

router.post("/createSlots",authFactory.protect(Doctor),appointmentController.restrictTo("doctor"),appointmentController.postSlots);
router.get("/allAppointmentOfMine",authFactory.protect(Doctor),appointmentController.restrictTo("doctor"),appointmentController.getAllAppointments)

router.get("/upComingAppointments",authFactory.protect(Doctor),appointmentController.restrictTo("doctor"),appointmentController.getAllUpcomingAppointment)
router.get("/allAttendAppointments",authFactory.protect(Doctor),appointmentController.restrictTo("doctor"),appointmentController.getAllDoneAppointment);

router.patch("/bookAppointment",authFactory.protect(Patient),appointmentController.restrictTo("user"),appointmentController.bookAppointment);
router.patch("/cancleAppointment",authFactory.protect(Doctor),appointmentController.restrictTo("doctor"),appointmentController.cancleAppointment);
router.patch("/makeAppointmentDone",authFactory.protect(Doctor),appointmentController.restrictTo("doctor"),appointmentController.doneAppointment);

router.get("/findByPatientName",authFactory.protect(Doctor),appointmentController.restrictTo("doctor"),appointmentController.getAppointmentByName);
// router.patch("/makeSlotEmpty",authFactory.protect(Doctor),appointmentController.restrictTo("doctor"),appointmentController.reOpenAppointment)

module.exports=router