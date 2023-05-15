const express = require("express");
const patientAuth=require("../controlles/patientAuthenticate");
const reviewController=require("./../controlles/reviewController")

const router=express.Router({mergeParams:true});

router.route("/")
    .get(patientAuth.protect, reviewController.getAllReview)
    .post(patientAuth.protect,patientAuth.restrictTo("user"),reviewController.isThereReview,reviewController.postReview);

module.exports=router;