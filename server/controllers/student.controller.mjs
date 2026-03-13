import studentProfile from "../models/studentProfile.mjs";
import userData from "../models/userData.mjs";

export const completeProfile =async(req,res)=>{

    try{
         const {rollNo,branch,roomNo,hostelName,admissionYear}=req.body;
    if(!rollNo ||!branch || !roomNo || !hostelName || !admissionYear){
        return res.status(400).json({
        success:false,
        message:"All fields are required"

    })
    }
    const user=req.user;
    const match = user.email.match(/\d+/);

    if(!match){
        return res.status(400).json({
        success:false,
        message:"Invalid email format"
    })
   }

const emailRoll = match[0];
    if(rollNo!==emailRoll){
        return res.status(400).json({
            success:false,
            message:"Email and roll no doesn't belong to one student"

        })
    }
        
    const existingUser=await studentProfile.findOne({userId:user._id})
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"Profile already completed"
        })
    }

     const profile=await studentProfile.create({
        userId: user._id,
        rollNo,
        branch,
        roomNo,
        hostelName,
        admissionYear
    })
    return res.status(201).json({
        success:true,
        message:"Profile completed sucessfully",
        profile
    })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Server error",
            error:error.message
        })

    }

   

    
    



}