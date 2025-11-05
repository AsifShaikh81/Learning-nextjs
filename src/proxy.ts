
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// nextauth give getToken() function by using this function we can get the token

// note: whatever req(req like log in, log out, register etc) u make woh req middleware se hoke jati hai 

// req ayeggi
// middleware path nikalega 
      
export async function proxy(req:NextRequest){
const {pathname}=req.nextUrl
// this routes visible publicaly to user dont need to log in 
const publicRoutes=[
    "/login",
    "/register",
    "/api/auth",
    "favicon.ico",
    "_next"
]
// if public route toh aage jane do
if(publicRoutes.some(path=>pathname.startsWith(path))){
    return NextResponse.next()
}
    // getting token
    const token = await getToken({req,secret:process.env.NEXT_AUTH_SECRET})
    // if no token redirect to login page
    if(!token){
        const loginUrl=new URL("/login",req.url)
        loginUrl.searchParams.set("callbackUrl",req.url)
        return NextResponse.redirect(loginUrl)

    }
     // if u have token than u can go to home page
    return NextResponse.next()

}
//matcher - kaunse route par ye middleware run karna hai
export const config={
     // Matches all request paths except for API routes, static files,
    // image optimization files, and the favicon
    matcher:'/((?!api|_next/static|_next/image|favicon.ico).*)'
}