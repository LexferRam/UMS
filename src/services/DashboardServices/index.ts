import { headers } from "next/headers"

export const getUserEventsResp = async () => {
    try {
        const userEventsResp = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/api/admin/events`,
            {
                headers: headers(),
                cache: 'no-store'
                // next: {
                //   revalidate: 5000 // revalidate after 1 day ==>  ISR
                // }
            }
        )
        const userEvents = await userEventsResp.json()
        return userEvents
    } catch (error) {
        console.error(error)
    }
}

export const getReportsResp = async () => {
    try {
        const reportsResp = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/api/admin/reports`,
            {
                headers: headers(),
                cache: 'no-store'
                // next: {
                //   revalidate: 5000 // revalidate after 1 day ==>  ISR
                // }
            }
        )
        const reportsResponse = await reportsResp.json()
        return reportsResponse
    } catch (error) {
        console.error(error)
    }
}

export const getUserResp = async () => {
    try {
        const userResp = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/api/admin/user`,
            {
                headers: headers(),
                cache: 'no-store'
                // next: {
                //   revalidate: 5000 // revalidate after 1 day ==>  ISR
                // }
            }
        )
        const userResponse = await userResp.json()
        return userResponse
    } catch (error) {
        console.error(error)
    }
}