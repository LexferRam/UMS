// 'use client'

// import { Suspense } from "react"
// import dynamic from "next/dynamic"
import { useQuery } from "react-query"
import DashboardSkeleton from "@/components/DashboardSkeleton"
import { useSession } from "next-auth/react"
import DashboardTabs from '@/components/dashboardTabs/DashboardTabs'
// const DashboardTabs = dynamic(() => import('@/components/dashboardTabs/DashboardTabs'))
import { headers } from 'next/headers'
import nextAuth, { getServerSession } from "next-auth"
import { authOptions } from "@/util/authOptions"
import DashboardContainer from "@/components/DashboardContainer"

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

const AdminUserPage = async () => {
  
  const session: any = await getUserResp()
  const userEvent = await getUserEventsResp()
  const reports = await getReportsResp()

  // const { data: session, status } = useSession();

  // const { isLoading: isLoadingUserEvent, error: userEventError, data: userEvent = [], refetch: refetchUserEvent } = useQuery(['userEvent'], async ({ signal }) =>
  //   fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/events`, {
  //     signal,
  //   }).then(res =>
  //     res.json()
  //   ),
  //   {
  //     // keepPreviousData: true,
  //     // refetchInterval: false,
  //     refetchOnWindowFocus: true,
  //   })

  // const { isLoading: isLoadingReports, error: reportsError, data: reports = [], refetch: refetchReports } = useQuery(['reports'], async ({ signal }) =>
  //   fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/reports`, {
  //     signal,
  //   }).then(res =>
  //     res.json()
  //   ),
  //   {
  //     // keepPreviousData: true,
  //     // refetchInterval: false,
  //     refetchOnWindowFocus: true,
  //   })

  //status === 'authenticated' ||
  // if (isLoadingUserEvent || isLoadingReports) return <DashboardSkeleton />

  return (
    // <Suspense fallback={<DashboardSkeleton />}>
    <DashboardContainer
      // session={session}
      reportsInitData={reports}
      userEventInitData={userEvent}
      // missingReportsWithDate={userEvent?.arrDaysWithOutReports}
      // refecthFns={{
      //   // refetchUserEvent,
      //   // refetchReports
      // }}
    />
    // </Suspense>

  )
}

export default AdminUserPage

export const revalidate = 1
