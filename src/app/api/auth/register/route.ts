import connectDB from "@/lib/db";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

//Sign up/register route
export async function POST(req:NextRequest) {
    try {
        // getting from user
        const {name,email,password}= await req.json()
        // connecting db 
        //note -  every time u call api u have to connect db
        await connectDB()
  
        // checking user exit in db or not
        let existUser=await User.findOne({email})
        if(existUser){
            return NextResponse.json({
                message:'user already exist',
                status:400
            })
        }
        //check password is less than 6 char
        if(password.length<6){
             return NextResponse.json({
                message:'password must be atleast 6 character',
                status:400
            })
        }
        //hashing password
        const salt = 10
       const hashedPassword= await bcrypt.hash(password,salt)
       // creating user
       const user= await User.create({
        name,
        email,
        password:hashedPassword
       })

       return NextResponse.json({
                user,
                status:201
            })
    } catch (error) {
        return NextResponse.json({
                message:`register route error ${error}`,
                status:400
            })
    }
}