'use client'

import Link from "next/link"
import { cn } from "@/lib/utils"



import AsideMenuOptions from "./AsideMenuOptions"
import { Sheet, SheetContent, SheetTrigger } from "../ui/Sheet"
import { Button } from "../ui/button"
import DropdownMenuComp from "../DropdownMenu"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"


export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const { data: session } = useSession()
    return (
        <div className="flex h-16 items-center px-4 border-b mb-2 justify-between">
            <nav
                className={cn("flex items-center space-x-4 lg:space-x-6", className)}
                {...props}
            >
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="block md:hidden">Open</Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <div className="grid gap-4 py-4">
                            <AsideMenuOptions />
                        </div>
                    </SheetContent>
                </Sheet>
                <div>
                <Image src={session?.user?.image || ''} alt='' height={50} width={50} className='rounded-full cursor-pointer' />
                </div>
                <Link
                    href="/dashboard"
                    className="hidden sm:block text-sm font-medium transition-colors hover:text-primary"
                >
                    <b>Bienvenido:</b> {session?.user?.name || ''}
                </Link>
            </nav>
            <div className="flex items-center gap-5">
                
                <div>
                    <DropdownMenuComp />
                </div>
                <div>
                    <Button
                        variant="secondary"
                        onClick={async () => {
                            await signOut({
                                callbackUrl: '/'
                            })
                        }}
                    >Salir</Button>
                </div>
            </div>
        </div>
    )
}