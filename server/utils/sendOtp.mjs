import { generateOTP } from "./generateOTP.mjs";
import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify()
  .then(() => console.log("Email service ready"))
  .catch(console.error);

export const sendOtp = async (toEmail) => {
  try {
    const otp = generateOTP();
    console.log("OTP GENERATED:", otp);
    console.log("SENDING OTP TO:", toEmail);

   const info = await transporter.sendMail({
    from:`"Hostel Pulse" <${process.env.EMAIL_SENDER}>`, 
    to: toEmail,
    subject: "Email Verification OTP",
    text: `Your OTP is ${otp}. Valid for 10 minutes.` 
});

console.log("Email sent:", info.messageId);


    console.log("Email sent:", info.messageId);

    return otp; 
  } catch (error) {
    console.error("Failed to send OTP:", error);
    throw new Error("OTP email failed");
  }
};
