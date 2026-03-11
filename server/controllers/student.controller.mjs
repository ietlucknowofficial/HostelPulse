import studentProfile from "../models/studentProfile.mjs";
import userData from "../models/userData.mjs";

export const completeProfile =async(req,res)=>{

    const {rollNo,branch,roomNo,hostelName,admissionYear}=req.body;
    if(!rollNo ||!branch || !roomNo || !hostelName || !admissionYear){
        return res.status(400).json({
        success:false,
        message:"All fields are required"

    })
    }
    
    



}