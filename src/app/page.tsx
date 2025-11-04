'use client'
import { useSession } from 'next-auth/react'


function page() {
  const session = useSession()
  console.log(session?.data?.user)
  return (
    <div>page
      <div>email:{session?.data?.user?.email}</div>
      <div>name:{session?.data?.user?.name}</div>
      <div>image:{session?.data?.user?.image}</div>
    </div>
  )
}

export default page