const express = require("express");
const { todayAvailbleDoctor, allDoctors, oneDoctor, addDoctor, updateDoctor, deleteDoctor } = require("../controlles/doctorController");

const router = express.Router();

router.route("/avalabledoctors")
    .get(todayAvailbleDoctor);

router.route("/")
    .get(allDoctors)

router.route("/:id")
    .get(oneDoctor)
    .post(addDoctor)
    .put(updateDoctor)
    .delete(deleteDoctor)

module.exports = router;


