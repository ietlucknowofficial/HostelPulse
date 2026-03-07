import mongoose from "mongoose";

const otpSchema=new mongoose.Schema({
    email:{type:String,required:true},
    otpHash:{type:String,required:true},
    expiresAt:{type:Date,required:true,index:{expires:0}}
})
export default mongoose.model('Otp',otpSchema)