import mongoose from "mongoose";

const hostelSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true,
        trim: true
    }
})

export default mongoose.model('Hostel',hostelSchema)