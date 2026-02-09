import bcrypt from "bcryptjs"
import userData from "../models/userData.mjs";
import OTP from "../models/OTP.mjs";
import {sendOtp} from "../utils/sendOtp.mjs";
export const signup=async (req,res)=>{
    try{
        
        const {name,email,password,confirmPassword,role}=req.body
         console.log("STEP 2: body parsed");
        const normalizedEmail=email.toLowerCase().trim()
        console.log("STEP 3: email normalized");
        const existingUser=await userData.findOne({email:normalizedEmail});
        if(existingUser){
            return res.status(400).json({message:"Email already exists"})

        }
        if(password!==confirmPassword){
            return res.status(400).json({message:"Password doesn't match !"})

        }
        console.log("STEP 4: checked existing user");
        const hashPassword=await bcrypt.hash(password,10);
        console.log("STEP 5: password hashed");
        await userData.create({
            name,
            email:normalizedEmail,
            passwordHash:hashPassword,
            role:role,
            status:"Pending"
        });

        console.log("STEP 6: user created");

        await OTP.deleteMany({ email: normalizedEmail });
        console.log("STEP 7: old OTP deleted");
        const otp=await sendOtp(normalizedEmail)
        console.log("STEP 8: sendOtp called", otp);
        const otpHash=await bcrypt.hash(otp,10)
        await OTP.create({

            email:normalizedEmail,
            otpHash:otpHash,
            expiresAt:Date.now()+10*60*1000
        })
        res.status(201).json({message:"Signup successful. Please verify your email."});


    }
    catch{
        res.status(500).json({ message: "Server error" });

    }
}
