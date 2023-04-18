const express = require("express");
const { todayAvailbleDoctor, allDoctors, myProfile,findByName, updateDoctor, deleteDoctor } = require("../controlles/doctorController");
const {protect,restrictTo,signUp,logIn}=require("../controlles/doctorAuthenticate")

const router = express.Router();
router.route("/")
    .get(protect,restrictTo("admin"),allDoctors);

// router.get("/findByName",protect, findByName );


router.post("/logIn", logIn);

router.route("/avalabledoctors")
    .get(todayAvailbleDoctor);

// router.route("/findByName")
//     .get("findByName");

router.route("/:id")
    // .get(protect,myProfile)
    .post(protect, restrictTo("admin"),signUp)
    .put(protect,restrictTo("admin"),updateDoctor)
    .delete(protect,restrictTo("admin"),deleteDoctor);

module.exports = router;


