 const catchAsync=require("./../utli/catchAsync");
 const Patient=require("./../models/patientModel");
 const jwt=require("jsonwebtoken");
 const AppError=require("./appError");

// function to handle signUp request of new patient
 exports.signUp= catchAsync(async(req,res,next)=>{
    const newPatient= await Patient.create({
        name:req.body.name,
        age:req.body.age,
        address:req.body.address,
        bloodGroup:req.body.bloodGroup,
        phoneNumber:req.body.phoneNumber,
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPasswo rd
    })

    if(!newPatient){
        return next(new AppError(404, 'errror ............'));
    } 

    const token= jwt.sign({id:newPatient._id},process.env.SECERT_STR);
        res.status(200).json({
            message: "Successfull !",
            token: token,
            status: 200,
            result: newPatient
        });
});

// function handle and varification for login
exports.logIn=catchAsync(async(req,res,next)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return next(new AppError(404,"plz provide email and password"));
    }

    const user=await Patient.findOne({email}).select('+password');
    console.log(user)
      
    if(!user  ){
        return next(new AppError(404,"user not found"));
    }

    isVarified=await user.correctUser(password,user.password);
    if(!isVarified){
        return next(new AppError(404,"invalid password"));
    }

    res.status(200).json({
        login:"succsefull",
        data:user
     })
})