const express = require("express");
const firm=require("express-formidable")
const Auth = require("../controlles/patientAuthenticate");
const{getTodayAvailbleDoctors,getDoctorByName,getAllDoctors,getDoctorProfile}=require("./../controlles/doctorController");
const {getAllPatients,getMyProfile,deletePatient,updatePatient ,setData,uploadImg} = require("../controlles/patientController");
const {getAllReports,postReport}=require("./../controlles/reportController");

const router = express.Router();

router.post("/upload",firm(),uploadImg);
router.post("/signUp",setData, Auth.signUp);
router.post("/logIn", Auth.logIn);
router.post("/addReport",Auth.restrictTo("doctor"),postReport)

router.get("/",getAllPatients);
router.get("/findByName",Auth.protect,getDoctorByName)
router.get("/alldoctor",Auth.protect,getAllDoctors)
router.get("doctor/:id",Auth.protect,getDoctorProfile)
router.get("/availbleDoctors",Auth.protect,getTodayAvailbleDoctors);
router.get("/getReports",Auth.protect,getAllReports)

router.patch("/forgetPassword/:token", Auth.forgetPassword);
router.patch("/updatePassword", Auth.protect, Auth.updatePassword)

router.route("/:id")
    .get(Auth.protect, getMyProfile)
    .post(Auth.protect, Auth.restrictTo("doctor"), Auth.signUp)
    .patch(Auth.protect, updatePatient)
    .delete(Auth.protect, deletePatient)

module.exports = router;
