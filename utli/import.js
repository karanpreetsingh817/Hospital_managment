const fs=require("fs");
const Tour=require("../models/reviewModel");
const User=require("../models/reportsModel")
const mongoose=require("mongoose");


mongoose.connect("mongodb+srv://KARANSINGH:nAzPoi2n06CtxVu8@hopify.o3boscn.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(data => {
    console.log("connection succsefully with atlas")
}).catch(err => {
    console.log("error error !!!");
});


const review= JSON.parse(fs.readFileSync(`${__dirname}/doctorData.json`,'utf-8'));
const user_data=JSON.parse(fs.readFileSync(`${__dirname}/patientData.json`,'utf-8'));



const importAll=async()=>{
    try{
        res=Tour.deleteMany();
//    for(let user of review){
//     res=await new Tour(user);
//     res.save()
//     console.log("data added successfully");
   }

    
    catch(err){
        console.log(err);
    }
}



importAll()