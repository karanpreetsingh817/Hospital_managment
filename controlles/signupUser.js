 const catchAsync=require("./../utli/catchAsync");
 const Patient=require("./../models/patientModel")
 const signUp=catchAsync(async(req,res,next){
    const newPatient= await Patient.create({
        name:req.body.name,
        age=req.body.age,
        address=req.body.address,
        bloodGroup=req.body.bloodGroup,
        phoneNumber=req.body.phoneNumber,
        email=req.body.email,
        password=req.body.password,
        confirmPassword=req.body.confirmPassword

    });
    
 });

 

 module.exports=signUp;
