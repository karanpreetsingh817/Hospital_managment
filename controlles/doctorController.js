const catchAsync = require("../utli/catchAsync");

// 1.Route to handle query of all available doctors
exports.todayAvailbleDoctor = catchAsync(async (req, res) => {
    res.status(200).json({
        status: "success",
        statusCode: 200,
        result: "done"
    });
});

// function to handle query to find all doctors
exports.allDoctors = catchAsync(async (req, res) => {
    res.status(200).json({
        status: "success",
        statusCode: 200,
        result: "there result of all docrtor request"
    });
});

// function to find only one  specific doctor
exports.oneDoctor = catchAsync(async (req, res) => {
    res.status(200).json({
        status: "success",
        statusCode: 200,
        result: "This is perticular dr. detail"
    });
});

// function to add new doctor into database /or website
exports.addDoctor = catchAsync(async (req, res) => {
    res.status(200).json({
        status: "success",
        statusCode: 200,
        result: "New doctor added successfully"
    });
});

// route handler to handle updation of Doctor
exports.updateDoctor = catchAsync(async (req, res) => {
    res.status(200).json({
        status: "success",
        statusCode: 200,
        result: "New doctor added successfully"
    });
});

// route to handle deleteion of existing doctor from data base
exports.deleteDoctor = catchAsync(async (req, res) => {
    res.status(200).json({
        status: "success",
        statusCode: 200,
        result: "New doctor added successfully"
    });
});
