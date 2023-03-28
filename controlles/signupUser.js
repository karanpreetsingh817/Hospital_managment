 const catchAsync=require("./../utli/catchAsync");
 const Patient=require("./../models/patientModel");
 const jwt=require("jsonwebtoken");

 const signUp=catchAsync(async(req,res,next)=>{
    console.log("inside signup")
    const newPatient= await Patient.create({
        name:req.body.name,
        age:req.body.age,
        address:req.body.address,
        bloodGroup:req.body.bloodGroup,
        phoneNumber:req.body.phoneNumber,
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword

    });
    const token= jwt.sign({id:newPatient._id},process.env.SECERT_STR);

    res.status(200).json({
        status:"successfull",
        statusCode:200,
        result:newPatient
    })
    console.log("done")
    

 });

 

 module.exports=signUp;
