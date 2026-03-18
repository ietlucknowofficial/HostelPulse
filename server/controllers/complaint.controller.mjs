
import complaints from "../models/complaints.mjs";
import studentProfile from "../models/studentProfile.mjs";

export const createComplaint=async(req,res)=>{

    try {
        const {complaintName,description,location,category,photos}=req.body;
        if(!complaintName||!description||!location||!category){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const student=await studentProfile.findOne({ userId: req.user._id })
        const complaint=await complaints.create({
            userId: req.user._id,
            complaintName,
            description,
            location,
            category,
            hostelId:student.hostelId,
            photos:photos||[],
            status:"pending",


        })
        return res.status(201).json({
            success:true,
            message:"Complaint Created Successfully",
            complaint

        })
        
    } catch (error) {
         return res.status(500).json({
            success:false,
            message:"Server error",
            error:error.message
        })

        
    }
    

    

}