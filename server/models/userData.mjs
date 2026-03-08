import mongoose, { mongo } from "mongoose"
const userSchema=new mongoose.Schema({
        name:{type:String,required:true},
        email:{type:String,required:true,unique:true,match:[/^[a-zA-Z0-9]+@ietlucknow\.ac\.in$/, "Email must be in format rollno@ietlucknow.ac.in"]},
        passwordHash:{type:String,required:true},
        role:{type:String,enum:["Student","Admin"],required:true},
        isEmailVerified:{type:Boolean,default:false},
        status:{type:String ,enum:["Pending","Active","Blocked"],default:"Pending"} ,
        isFirstLogin:{type:Boolean,default:true},
        tempPasswordExpiresAt:{ type:Date },
},
          {timestamps:true}
     
)
export default mongoose.model("User",userSchema);