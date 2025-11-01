//how we create mongodb connection in express
// step 1 -connectDB function 
// step 2 -mongoose.connect('mongodbUrl')

import { connect} from "mongoose"

// we will not connect mongodb like we used to connect in express why? bcz of hot reload, check pdf

//next js mein jab api call hota server open hota fir band hojata hai. jab bhi hot reload hoaga toh server bar bar on off hoga, isliye hum usse cached mein store karenge fir zarwat pade toh call karenge 

let mongodbUrl=process.env.MONGODB_URL
if(!mongodbUrl){
    throw new Error('mongodb url not found')
}

let cached=global.mongoose

if(!cached){
    cached= global.mongoose = {conn:null,promise:null}
}

const connectDB = async () => {
if(cached.conn){
    console.log('cached db connected')
    return cached.conn
}
// agar cached bhi null hai aur promise bhi null hai toh fir mongoose ke through connect karenge
if(!cached.promise){
cached.promise =connect(mongodbUrl).then((c)=>c.connection)
}

try {
   cached.conn= await cached.promise
   console.log('db connected')
} catch (error) {
  throw error  
}
return cached.conn
}
export default connectDB

//* why we use global variable to store it in cache
/* // *⚙️ Pehle problem samajh:

Next.js jab tu development mode (npm run dev) mein chalata hai —
toh har baar jab tu file save karta hai, Next.js hot reload karta hai.

Ab hot reload hone ka matlab:

-Next.js code ko dobara load karta hai
-Har file dobara import hoti hai
-Aur jo variables humne file ke andar declare kiye hain, wo reset ho jaate hain */

/* //* ✅ Solution: global object

Node.js ke andar ek global object hota hai (browser ke window jaise).
Ye ek baar create hota hai aur puray app ke dauraan memory mein bana rehta hai,
even agar file reload ho jaaye tab bhi.

Toh hum connection ko global variable ke andar store kar lete hain
taaki wo persist (bana rahe) even after hot reload. */

/*  //*⚙️ Fayda:

💨 Fast — baar baar connect nahi karna padta

🚫 No “too many connections” error

🔥 Development mein stable rehta hai even after hot reload  */

/* //* 🏁 Simple Summary:

Hot reload hone se normal variables reset ho jaate hain,
lekin global variable reset nahi hota,
isliye hum MongoDB connection ko global mein store karte hain taaki reuse ho sake aur baar-baar reconnect na karna pade. */