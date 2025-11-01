import { NextAuthOptions } from "next-auth"
import  CredentialsProvider  from "next-auth/providers/credentials"
import connectDB from "./db"
import User from "@/model/user.model"
import bcrypt from "bcryptjs"

const authOptions:NextAuthOptions={
    // login kaise karenge 
providers:[
CredentialsProvider({
    name:"Credentials",
    // sign in karate waqt ye fields front end se ara hai
    credentials:{
        email:{label:'Email',type:'text'},
        password:{label:'password',type:'password'}
    },
    //authorizing  user while sign in 
    async authorize(credentials, req) {
      // getting email and password
      let email = credentials?.email
      let password = credentials?.password
      //check email or password exist or not
      if(!email || !password){
        throw new Error('email or password is not found')

      }
      //connecting db 
      await connectDB()
      // checking in db, is user exist by email
      let existUser = await User.findOne({email})
      // if user not exist sign up
      if(!existUser){
        throw new Error('user not found please sign up')
      }
      //checking password: password store in db is hashed ,user entered password in plain text, so we have to compare user entered password and hashed password in db, if password mathced it will return true.
      // password:<user entered password>
      //  existUser:<hased password from db>
      let isMatch=await bcrypt.compare(password,existUser.password)
      // if password not matched
      if (!isMatch) {
        throw new Error('incorrect password')
      }
      return {
        id:existUser._id,
        name:existUser.name,
        email:existUser.email,
        image:existUser.image
      }
    },
    
})
],
callbacks:{},
session:{},
pages:{},
secret:''
}

export default authOptions

//*credential provider - email ,password ka use kar ke sign in karana 
//*providers - google,github etc
//*callbacks - token etc
//*session -  front end mein data kaise aa raha hai, token se ara hai ya db se
//*secret: jwt secret