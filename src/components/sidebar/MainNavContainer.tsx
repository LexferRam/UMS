'use client'

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "../ui/button"
import { signOut } from "next-auth/react"
import Image from "next/image"
import { Bars3Icon } from "@heroicons/react/24/outline";
import { DrawerWithNavigation } from "./NavegationDrawer"
import Typography from '@mui/material/Typography';
import { AppBar } from "@mui/material"


export function MainNavContainer({
    userInfo,
}: any) {
    const [open, setOpen] = useState(false)

    const openDrawer = () => setOpen(true);

    return (
        <>
            <AppBar style={{ backgroundColor: 'white', position: 'static', color: 'black', width: '100%' }} className="z-30 px-6 py-4">
                <div className="flex items-center justify-between text-blue-gray-900">

                    <div className="flex items-center mr-2 sm:mr-10">
                        <Bars3Icon className=" h-6 w-6 mr-4 cursor-pointer" onClick={openDrawer} strokeWidth={2} />

                        <Link
                            href="/dashboard"
                            className=" text-sm font-medium transition-colors hover:text-gray-600"
                        >
                            <Image
                                src='/logo9.png'
                                alt='logo_login'
                                width={50}
                                height={50}
                                priority
                            />
                        </Link>
                        <div className="flex items-center gap-4 ml-6">
                            <div>
                                <Typography variant="subtitle1">{userInfo?.name || ''}</Typography>
                                <Typography variant="body2" color="gray" className="font-normal text-gray-500">
                                    {userInfo?.role === 'admin' ? 'Administrador' : 'Terapeuta'}
                                </Typography>

                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">

                        <Image
                            src={userInfo?.lastname || ''}
                            alt=''
                            height={50}
                            width={50}
                            className='hidden sm:block rounded-full cursor-pointer mr-2'
                        />

                        <div>
                            <Button
                                variant="secondary"
                                onClick={async () => {
                                    await signOut({
                                        callbackUrl: '/'
                                    })
                                }}
                            >
                                Salir
                            </Button>
                        </div>
                    </div>
                </div>
            </AppBar>
            <DrawerWithNavigation open={open} setOpen={setOpen} userInfo={userInfo} />
        </>
    )
}
