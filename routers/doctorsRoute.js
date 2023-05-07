const express = require("express");
const firm=require("express-formidable")
const Auth=require("../controlles/doctorAuthenticate");
const reviewRoute=require("./reviewRoute");

const { getAllDoctors, getMyProfile,updateDoctor, deleteDoctor,setData ,uploadImg} = require("../controlles/doctorController");

const router = express.Router();


router.get("/",Auth.protect, Auth.restrictTo("admin"),setData,getAllDoctors);
router.post("/upload", firm(),uploadImg);
router.post("/signup",Auth.restrictTo("admin"),setData,Auth.signUp)
router.use("/:doctorId/reviews",reviewRoute)
router.post("/logIn", Auth.logIn);

router.route("/:id")
    .get(Auth.protect,Auth.restrictTo("doctor"),getMyProfile)
    .put(Auth.protect,Auth.restrictTo("admin",'doctor'),updateDoctor)
    .delete(Auth.protect,Auth.restrictTo("admin"),deleteDoctor);

module.exports = router;


