const express=require("express");
const {allPatient,onePatient,addPatient,updatePatient,deletePatient}=require("./../controlles/patientRouteHandler");

const router=express.Router();

router.route("/")
.get(allPatient)





router.route("/:id")
.get(onePatient)
.post(addPatient)
.put(updatePatient)
.delete(deletePatient)



module.exports=router;