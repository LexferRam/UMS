'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          src='/logo9.png'
          alt='logo_login'
          width={100}
          height={200}
          priority
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Mundo Sensorial</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <div className="mb-0 space-y-6" >
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
              <div className="mt-1">
                <input id="userName" name="userName" type="text" autoComplete="userName" className="" />
              </div>
            </div>

            {/* <div>
              <button 
                type="submit" 
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => signIn("google",{
                  callbackUrl: '/dashboard'
                })}
              >
                Ingresar con Google
              </button>
            </div> */}

            <div className='g-sign-in-button'
            onClick={() => signIn("google",{
              callbackUrl: '/dashboard'
            })}
            >
              <div className='content-wrapper'>
                <div className='logo-wrapper'>
                  <img src='https://developers.google.com/identity/images/g-logo.png' alt=''/>
                </div>
                <span className='text-container'>
                  <span>Sign in with Google</span>
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
