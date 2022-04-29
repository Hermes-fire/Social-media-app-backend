const nodemailer = require("nodemailer");
const variables = require('../config/variables')

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: variables.MAILSERVICE,
      auth: {
        user: variables.EMAIL,
        pass: variables.PASS,
      },
      tls: {
          rejectUnauthorized: false,
      }
    });

    await transporter.sendMail({
      from: variables.EMAIL,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;