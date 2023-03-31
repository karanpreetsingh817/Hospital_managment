const express=require("express");
const {allPatient,onePatient,addPatient,updatePatient,deletePatient}=require("./../controlles/patientRouteHandler");
const {signUp,logIn}=require("./../controlles/signupUser")

const router=express.Router();

router.route("/").get(allPatient)
router.post("/signUp", signUp)
router.get("/logIn", logIn)

router.route("/:id")
.get(onePatient)
.post(addPatient)
.put(updatePatient)
.delete(deletePatient)

module.exports=router;