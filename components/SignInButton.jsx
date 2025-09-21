'use client'

import React from 'react'
import { signIn } from 'next-auth/react'

export default function SignInButton({provider}) {
  return (
    <div>
      <button onClick={()=>signIn(provider.id, {callbackUrl: '/'})} className='bg-red-400 p-3 text-white hover:bg-red-500 rounded-lg cursor-pointer'>Sign in with {provider.name}</button>
    </div>
  )
}
