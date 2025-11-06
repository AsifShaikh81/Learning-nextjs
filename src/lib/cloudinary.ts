import { v2 as cloudinary } from 'cloudinary'
import { error } from 'console';
import { resolve } from 'path';
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinaty=async (file:Blob | null):Promise<string | null>=>{
    // if no file retur null , dont go ahead
    if(!file){
        return null
    }
    try {
    const arrayBuffer=await file.arrayBuffer() // converting file to arraybuffer
    const buffer = Buffer.from(arrayBuffer) // converting arraybuffer to buffer bcz of nodejs
  
  return new Promise ((resolve,reject)=>{
    // uploading to cloudinary
       const uploadStream = cloudinary.uploader.upload_stream(
        {resource_type:"auto"}, // typr of filr image or video
        (error,result)=>{
            if(error){reject(error)} // if error reject promise
            else{resolve(result?.secure_url ?? null)} // else success resolve promise
        }
    )
    uploadStream.end(buffer)
  })      
    } catch (error) {
        console.log(error);
        return null
        
    }
  
}