const express = require("express");
const { todayAvailbleDoctor, allDoctors, myProfile,findByName, isAvailble,updateDoctor, deleteDoctor ,getAllAppointment} = require("../controlles/doctorController");
const {protect,restrictTo,signUp,logIn}=require("../controlles/doctorAuthenticate")

const router = express.Router();
router.route("/")
    .get(protect,restrictTo("admin"),allDoctors);


router.patch("/isAvailble",protect,isAvailble)


router.get("/logIn", logIn);

router.route("/availbleDoctors")
    .get(protect,todayAvailbleDoctor);
    

router.route("/showAllAppointments")
.get(protect,getAllAppointment);


router.route("/:id")
    .get(protect,restrictTo("doctor"),myProfile)
    .post(protect, restrictTo("admin"),signUp)
    .put(protect,restrictTo("admin"),updateDoctor)
    .delete(protect,restrictTo("admin"),deleteDoctor);

module.exports = router;


