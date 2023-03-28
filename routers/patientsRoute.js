const express=require("express");
const {allPatient,onePatient,addPatient,updatePatient,deletePatient}=require("./../controlles/patientRouteHandler");
const signUp=require("./../controlles/signupUser")
const router=express.Router();



router.route("/")
.get(allPatient)
router.post("/signup",signUp)






router.route("/:id")
.get(onePatient)
.post(addPatient)
.put(updatePatient)
.delete(deletePatient)



module.exports=router;