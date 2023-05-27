const nodemailer = require("nodemailer");
module.exports = async options => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: `healthease90009@gmail.com`,
            pass: "qkdgiebzkbfoshnm "
        }
    });

    const mailOptions = {
        from: "HEALTH-EASE <healthease90009@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
};