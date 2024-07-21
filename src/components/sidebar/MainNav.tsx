
import React from "react"
import { MainNavContainer } from "./MainNavContainer"
import { headers } from 'next/headers'

export const getUserResp = async () => {
    try {
        const userResp = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/api/admin/user`,
            {
                headers: headers(),
                next: {
                    revalidate: 1 // revalidate after 1 day ==>  ISR
                }
            }
        )
        const userResponse = await userResp.json()
        return userResponse
    } catch (error) {
        console.error(error)
    }
}

export async function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {

    const session: any = await getUserResp()

    return <MainNavContainer userInfo={session} {...props}/>
}
