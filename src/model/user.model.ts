import mongoose from "mongoose";


interface Iuser{
    _id?:mongoose.Types.ObjectId,
    name:string,
    image:string,
    email:string,
    password?:string,
    createdAt?:Date,
    updatedAt?:Date,

}

const userSchema = new mongoose.Schema<Iuser>({
name:{type:String,required:true},
email:{type:String,required:true,unique:true},
password:{type:String}, // false bcz of google auth
image:{type:String}

},{timestamps:true})

// const User= mongoose.model('User',userSchema) this line will throw error ,why? bcz nextjs hot reloads, check pdf

//what is hot reload?
//everytime file changes or new api called backend dobara run hota hai
const User= mongoose.models.User ||mongoose.model('User',userSchema) 
export default User 