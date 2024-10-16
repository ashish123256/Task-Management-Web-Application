import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
    fullName:{type:String},
    email:{type:String,unique:true},
    password:{type:String},

},{timestamps:true})


const User = mongoose.model("User",userSchema);

export default User;