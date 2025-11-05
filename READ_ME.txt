1)MONGODB
🔹inside model folder:
    user.model.ts

🔹inside lib folder:
    db.ts(for connection)

🔹inside src folder:
    types.d.ts


2)NEXT AUTH
🔹inside app folder: 
    created register route -> api/auth/register/route.ts
    NextAuth -> api/auth/[...nextauth]/route.ts

🔹inside lib folder -> auth.ts(authOptions)

🔹inside src:
    next-auth.d.ts

3)register & login(front-end, fetching data from back end )
🔹inside app folder:
    register/page.tsx
    login/page.tsx

🔹inside src folder:
    ClientProvider - for wrapping sessionProvider in main/root layout.tsx

4)GOOGLE AUTH
🔹auth.ts - created google provider
🔹google cloud console - yaha se client id and secret key liya
🔹next auth- https://next-auth.js.org/providers/google(doc)

4)create home page
🔹main page.tsx: 
   🔹fetched data from back end - images, names 
   🔹created sign out function

5)middleware
🔹Note: The middleware file convention is deprecated and has been renamed to proxy . See
Migration to Proxy for more details.
🔹without login user can't access home page
🔹inside src folder: