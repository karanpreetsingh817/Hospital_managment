const nodemailer = require("nodemailer");
const { eventNames } = require("../models/patientModel");

module.exports = async options => {
    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: "HEALTH-EASE <business@hot.io>",
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};



// const nodemailer = require("nodemailer");
// const { eventNames } = require("../models/patientModel");

// module.exports = async options => {
//     const transporter = nodemailer.createTransport({
//         host: "sandbox.smtp.mailtrap.io",
//         port: 2525,
//         auth: {
//             user: "dfbbd0b0efef18",
//             pass: "f411a74c52c1a1"
//         }
//     });

//     const mailOptions={
//         from:"HEALTH-EASE   <usiness@hot.io>",
//         to: options.email,
//         suject:options.suject,
//         text:options.message
//     }
//     await transporter.sendMail(mailOptions);
// };