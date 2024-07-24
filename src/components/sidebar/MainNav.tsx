
import React from "react"
import { MainNavContainer } from "./MainNavContainer"
import { getSession } from "@/util/authOptions"

export async function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {

    const session = await getSession() as any

    return <MainNavContainer userInfo={session} {...props}/>
}
