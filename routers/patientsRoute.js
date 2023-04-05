const express = require("express");
const {
    allPatient,
    onePatient,
    addPatient,
    updatePatient,
    deletePatient,
} = require("../controlles/patientController");
const {
    signUp,
    logIn,
    protect,
    restrictTo,
    forgetPassword,
} = require("../controlles/authrization");

const router = express.Router();

router.route("/").get(protect, restrictTo("doctor"), allPatient);
router.post("/signUp", signUp);
router.post("/logIn", logIn);

router.patch("/forgetPassword/:token", forgetPassword);


router
    .route("/:id") 
    .get(protect, onePatient)
    .post(protect, restrictTo("doctor"), addPatient)
    .put(protect, restrictTo("doctor"), updatePatient)
    .delete(protect, deletePatient);

module.exports = router;
