import authOptions from "@/lib/auth";
import uploadOnCloudinaty from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import User from "@/model/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
  try {
    await connectDB()
    //next auth provides getServerSession()
    const session =await getServerSession(authOptions) // get current logged in user 
    console.log(session)
    if(!session || !session.user.email || !session.user.id){
        return NextResponse.json(
            {message:"user not  logged in"},
            {status:400}
        )
    }
    // getting name and file(image) from form
    const formData =await req.formData()
    const name=formData.get('name') as string
    const file=formData.get('file') as Blob || null
     
    
    let imageUrl;

    if(file){
        imageUrl=await uploadOnCloudinaty(file)
    }
    const user = await User.findByIdAndUpdate(session.user.id,{
        name,image:imageUrl
    },{new:true})

    if(!user){
          return NextResponse.json(
            {message:"user not found"},
            {status:400}
        )
    }
      return NextResponse.json(
            user,
            {status:200}
        )
  } catch (error) {
      return NextResponse.json(
            {message:`edit error ${error}`},
            {status:500}
        )
  }
}