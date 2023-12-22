'use client'

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "../ui/button"
import { signOut } from "next-auth/react"
import Image from "next/image"


import {
    IconButton,
    Navbar,
    Typography,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { DrawerWithNavigation } from "./NavegationDrawer"
import { useUserInfo } from "@/hooks"


export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const [userInfo] = useUserInfo()
    const [open, setOpen] = useState(false)

    const openDrawer = () => setOpen(true);

    return (
        <>
            <Navbar className="sm:fixed z-30 w-full px-6 text-black" placeholder=''>
                <div className="flex items-center justify-between text-blue-gray-900">

                    <div className="flex items-center mr-2 sm:mr-10">
                        <Bars3Icon className=" sm:hidden h-6 w-6 mr-4 cursor-pointer" onClick={openDrawer} strokeWidth={2} />

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
                                <Typography placeholder='' variant="h6">{userInfo[0]?.name || ''}</Typography>
                                <Typography placeholder='' variant="small" color="gray" className="font-normal text-gray-500">
                                    {userInfo[0]?.role === 'amidn' ? 'Administrador' : 'Especialista'}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        {/* <div>
                            <DropdownMenuComp />
                        </div> */}


                        <Image src={userInfo[0]?.lastname || ''} alt='' height={50} width={50} className='hidden sm:block rounded-full cursor-pointer mr-2' />

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
            </Navbar>
            <DrawerWithNavigation open={open} setOpen={setOpen} />
        </>
    )
}
