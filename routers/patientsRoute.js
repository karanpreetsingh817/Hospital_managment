const express = require("express");
const{todayAvailbleDoctor,findByName}=require("./../controlles/doctorController");
const {allPatient,myProfile,deletePatient,updateMe} = require("../controlles/patientController");

const {signUp,logIn,protect,restrictTo,forgetPassword,updatePassword} = require("../controlles/patientAuthenticate");

// const {addReview,updateReview}=require("./../controlles/reviewController");
const {allReports,addReport}=require("./../controlles/reportController");

const router = express.Router();

router.route("/").get(protect, restrictTo("admin"),allPatient);
router.get("/findByName",protect,findByName)
router.post("/signUp", signUp);
router.post("/logIn", logIn);

router.get("/findByName",protect, findByName );

router.route("/availbleDoctors")
    .get(protect,todayAvailbleDoctor);

router.patch("/forgetPassword/:token", forgetPassword);
router.patch("/updatePassword", protect, updatePassword)

// router.route("/addReview")
//     .post(protect,addReview)
//     .patch(protect,updateReview)

router.route("/getReports")
    .get(protect,allReports)
    
    router.route("/addReport")
    .post(restrictTo("doctor"),addReport)

router.route("/:id")
    .get(protect, myProfile)
    .post(protect, restrictTo("doctor"), signUp)
    .patch(protect, updateMe)
    .delete(protect, deletePatient)

module.exports = router;
