const express=require("express");
const authFactory=require("./../controlles/authFactory");
const Doctor=require("./../models/doctorModel");
const Patient=require("./../models/patientModel");
const reportController=require("./../controlles/reportController");

const router=express.Router();

router.get("/",authFactory.protect(Doctor),reportController.restrictTo("admin"),reportController.getAllReports);
router.get("/myReports",authFactory.protect(Patient),reportController.restrictTo("user"),reportController.getReportHistory);

router.route("/:patientId")
    .get(authFactory.protect(Doctor),reportController.restrictTo("doctor"),reportController.getReportHistory)
    .post(authFactory.protect(Doctor),reportController.restrictTo("doctor"),reportController.postReport);

module.exports=router;