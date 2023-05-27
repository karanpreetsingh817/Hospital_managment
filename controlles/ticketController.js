
const Ticket = require("../models/ticket");
const AppError = require("./../utli/appError");
const catchAsync = require("./../utli/catchAsync");
const sendEmail=require("../utli/email")

exports.getAllTicket=catchAsync(async(req,res,next)=>{
    console.log("heerree_____________________")
    const tickets=await Ticket.find();
    if(tickets.length===0){
        res.status(200).json({
            status:"successfull",
            statusCode:201,
            message:"There Is No Ticket In Database",
            result:[]
        })
    }
    res.status(200).json({
        status:"successfull",
        statusCode:201,
        message:"Here All Tickets",
        result:tickets
    })
});

exports.postTicket=catchAsync(async(req,res,next)=>{
    const tickets=await Ticket.find();
    const ticketNumber=tickets.length + 1;
    const ticket=await new Ticket({
        userName:req.body.userName,
        email:req.User.email,
        issue:req.body.issue,
        id:req.User._id,
        role:req.User.role,
        ticketNumber
    });
    await ticket.save()
    if(!ticket){
        return next(new AppError(500,"Ticket Is No Genrated At This Moment"));
    }
    const message=`
 Dear Healthease,
 ${ticket.issue}
 
 Thank you for your cooperation.
 
 Kind regards,
 
 ${req.User.name}
 ${req.User.email}
 ${req.User.phoneNumber}`
    await sendEmail({
        email: process.env.TICKET_EMAIL,
        subject: ticket.ticketNumber,
        message
    })
   
    res.status(200).json({
        status:"successfull",
        statusCode:201,
        message:"Ticket genrated successfully",
        result:ticket
    })

})
