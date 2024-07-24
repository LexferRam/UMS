
export const getUserEventsResp = async (cookies: any) => {
    try {
        const userEventsResp = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/api/admin/events`,
            {
                headers: {
                    'Cookie': cookies
                },
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

export const getReportsResp = async (cookies: any) => {
    try {
        const reportsResp = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/api/admin/reports`,
            {
                headers: {
                    'Cookie': cookies
                },
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
