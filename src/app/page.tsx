'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'

export default function Home() {
  return (
    <div className='grid grid-col-2'>
      <div className='hidden md:block w-full h-ful bg-cover bg-[url("/login1.png")] bg-bottom brightness-[80%]'>
      </div>

      <div className="min-h-screen bg-[#eef2f6] flex flex-col justify-center py-12 px-6 lg:px-8">

        <div className="mt-8 sm:mx-auto sm:w-full shadow-2xl sm:max-w-md">
          <div className="bg-white py-12 px-6 rounded-2xl sm:px-10">
            <div className="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-md">
              <Image
                src='/logo9.png'
                alt='logo_login'
                width={100}
                height={200}
                priority
              />
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-700">Un Mundo Sensorial</h2>
            </div>
            <div className="mb-0 space-y-6 mt-10">
              {/* <div>
                <label className="block text-sm font-semibold text-gray-500">Nombre de Usuario</label>
                <div className="mt-4">
                  <input id="userName" name="userName" type="text" autoComplete="userName" className="" />
                </div>
              </div> */}

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
