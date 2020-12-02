const sgMail = require("@sendgrid/mail");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "./.env") });

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendVerificationEmail = async (user) => {
  const verificationLink = `${process.env.SERVER_DOMAIN}/auth/verify/${user.verificationToken}`;
  const msg = {
    to: user.email,
    from: "elena.kadru@gmail.com",
    subject: "Email verification",
    text: "Please verify your email",
    html: `<h2>Hello dear!</h2> <p>Please verify your email by following this <a href="${verificationLink}">verification link</a></p>`,
  };
  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (error) {
    console.error(error);
  }
};
