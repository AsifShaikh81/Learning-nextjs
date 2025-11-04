import { NextAuthOptions } from "next-auth"
import  CredentialsProvider  from "next-auth/providers/credentials"
import connectDB from "./db"
import User from "@/model/user.model"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google"

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
    
}),
Google({
  clientId:process.env.GOOGLE_CLIENT_ID!,
  clientSecret:process.env.GOOGLE_CLIENT_SECRET!
})
],
callbacks:{
  // for google
  //* note
  //if u are sign up or signing in with google no password needed

  //if u are signing up data base mein check karo agar account nahi hai toh create kardo
  async signIn({account,user}){
    // if provider is google
    if(account?.provider=='google'){
      // connect db
      await connectDB()
      // check  user exist by email
      let existUser = await User.findOne({email:user?.email})
      // if user not exist create it 
      if(!existUser){
        existUser=await User.create({
          name:user.name,
          email:user?.email
        })
      }
      //'user' -> does not contain id so we are assigning id from db
      user.id=existUser._id as string

    }
    return true
  },

  //token ke andar user detail dalna jo privders se return karne ke baad mila hai, 
  async jwt({token,user}){
    if(user){
    token.id=user.id
    token.name=user.name
    token.email=user.email
    token.image=user.image
    }
    return token
  },


// session ke andar  user details dalega token se, jiss se hum front end mein access kar sakte
session({session,token}){
  if(session.user){
    session.user.id=token.id as string
    session.user.name=token.name
    session.user.email=token.email
    session.user.image=token.image as string 

  }
  return session
},
},
session:{
   
  strategy:'jwt', // jwt se data le rahe hai
  maxAge: 30*24*60*60*1000// kab token/session expire hoga 30* 1 day *1 hour *1min * 1milisecond , expires after 30 days
},

pages:{
  signIn:'/login',
  error:'/login'
},
secret:process.env.NEXT_AUTH_SECRET
}

export default authOptions

//*credential provider - email ,password ka use kar ke sign in karana 
//*providers - google,github etc
//*callbacks - token etc
//*session -  front end mein data kaise aa raha hai, token se ara hai ya db se
//*pages - kis pages pe redirect hona hai according to need
//*secret: jwt secret