const express = require("express");
const Auth=require("../controlles/doctorAuthenticate");
const reviewRoute=require("./reviewRoute");
const { getAllDoctors, getMyProfile,updateDoctor, deleteDoctor,setData } = require("../controlles/doctorController");

const router = express.Router();
router.get("/",Auth.protect,Auth.restrictTo("admin"),getAllDoctors);
router.post("/signup",Auth.protect, Auth.restrictTo("admin"),setData,Auth.signUp)
router.use("/:doctorId/reviews",reviewRoute)
router.get("/logIn", Auth.logIn);




router.route("/:id")
    .get(Auth.protect,Auth.restrictTo("doctor"),getMyProfile)
    .put(Auth.protect,Auth.restrictTo("admin",'doctor'),updateDoctor)
    .delete(Auth.protect,Auth.restrictTo("admin"),deleteDoctor);

module.exports = router;


