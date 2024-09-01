'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'

export default function Home() {
  return (
    <div className='grid grid-col-2'>
      <div className="min-h-screen bg-[#eef2f6] flex flex-col justify-center py-12 px-6 lg:px-8">

        <div className="relative overflow-hidden rounded-2xl mt-8 sm:mx-auto sm:w-full shadow-2xl sm:max-w-md">

          <div>
            <div className='absolute -top-1/8 -right-12 w-[100px] h-[100px] bg-amber-200 rounded-full opacity-40' />
            <div className='absolute -top-16 -right-2 w-[100px] h-[100px] bg-amber-200 rounded-full opacity-40' />

            <div className='absolute -bottom-1 -right-16 w-[100px] h-[100px] bg-fuchsia-200 rounded-full opacity-40' />
            <div className='absolute -bottom-10 -right-1 w-[100px] h-[100px] bg-fuchsia-200 rounded-full opacity-40' />

            <div className='absolute -bottom-1 -left-16 w-[100px] h-[100px] bg-blue-200 rounded-full opacity-40' />
            <div className='absolute -bottom-12 -left-3 w-[100px] h-[100px] bg-blue-200 rounded-full opacity-40' />

            <div className='absolute -top-1/8 -left-16 w-[100px] h-[100px] bg-emerald-200 rounded-full opacity-40' />
            <div className='absolute -top-10 -left-6 w-[100px] h-[100px] bg-emerald-200 rounded-full opacity-40' />
          </div>

          <div className= "bg-white py-10 pb-16 px-6 rounded-2xl sm:px-10">
            <div className="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-md">
              <Image
                src='/logo9.png'
                alt='logo_login'
                width={100}
                height={200}
                priority
              />
              <h2 className="mt-6 text-center text-3xl font-bold text-gray-700">Un Mundo Sensorial</h2>
              {/* <h6 className='text-base '>(La Trinidad)</h6> */}
            </div>
            <div className="mb-0 mt-10">
              <div>
                <button
                  type="submit"
                  className="relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[rgb(54, 65, 82)] bg-[#f8fafc] hover:bg-[#e9eff5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f8fafc]"
                  onClick={() => signIn("google", {
                    callbackUrl: '/dashboard'
                  })}
                >
                  <img src="https://berrydashboard.io/free/static/media/social-google.9887eb8eb43729cb99f402cfa0de3c44.svg" className='w-4 h-4 absolute left-[10%] sm:left-[23%] top-3' />
                  Ingresar con Google
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
