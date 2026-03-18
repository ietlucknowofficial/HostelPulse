import mongoose from "mongoose";

const studentSchema=new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true},
    rollNo:{type:Number,required:true,unique:true},
    branch:{type:String,enum:["CSE-R","CSE-SF","CSE-AI","ECE","EE","ME","CHE","CE","MCA","MBA"],required:true},
    roomNo:{type:String,required:true},
   hostelId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Hostel",
  required: true
},
    admissionYear:{type:Number,required:true},



},{timestamps:true})

export default mongoose.model('Student',studentSchema)
