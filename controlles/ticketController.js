
const Ticket = require("../models/ticket");
const AppError = require("./../utli/appError");
const catchAsync = require("./../utli/catchAsync");
const sendEmail=require("../utli/email")

exports.getAllTicket=catchAsync(async(req,res,next)=>{
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
    subject: `Ticket Number- ${ticket.ticketNumber}`,
    message
})
   
const message2=`Subject: Acknowledgment of Your Complaint and Assuring Prompt Assistance

Dear ${req.User.name},

We hope this email finds you well. We would like to express our gratitude for bringing your concerns to our attention. Your feedback is invaluable in helping us improve our products and services to better serve our valued customers like you.

We understand the importance of addressing your complaint promptly and ensuring that it receives the attention it deserves. Our team has been notified about your concern, and they are currently reviewing the details to provide you with the best possible resolution.

Please be assured that we take your complaint seriously and will make every effort to resolve the issue to your satisfaction. Our dedicated team members are diligently working on your case and will be in contact with you shortly. They will provide you with updates and assist you throughout the process.

We kindly request your patience during this time as we strive to resolve your complaint. We aim to provide a timely and effective solution, and we appreciate your understanding in allowing us the necessary time to address your concerns thoroughly.

Once again, we apologize for any inconvenience caused by the issue you experienced. We value your feedback and the opportunity to make things right. Your satisfaction is our utmost priority.

If you have any additional information or questions, please do not hesitate to reach out to our customer support team at [customer support contact information]. They will be more than happy to assist you further.

Thank you for your understanding and cooperation. We genuinely appreciate your continued support as a valued customer.

Best regards,

Support Team
HealthEase
`

await sendEmail({
    email: req.User.email,
    subject: `Regarding Your Complaint `,
    message:message2
})
    res.status(200).json({
        status:"successfull",
        statusCode:201,
        message:"Ticket genrated successfully",
        result:ticket
    })

})
