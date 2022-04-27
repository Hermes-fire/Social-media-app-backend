const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aminenode@gmail.com',
        pass: 'Amine@123',
      },
      tls: {
          rejectUnauthorized: false,
      }
    });

    await transporter.sendMail({
      from: 'aminenode@gmail.com',
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