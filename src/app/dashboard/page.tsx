'use client'

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { useQuery } from "react-query"
import DashboardSkeleton from "@/components/DashboardSkeleton"
import { useSession } from "next-auth/react"
import DashboardTabs from '@/components/dashboardTabs/DashboardTabs'
// const DashboardTabs = dynamic(() => import('@/components/dashboardTabs/DashboardTabs'))

const AdminUserPage = () => {

  const { data: session, status } = useSession();

  const { isLoading: isLoadingUserEvent, error: userEventError, data: userEvent = [], refetch: refetchUserEvent } = useQuery(['userEvent'], async ({ signal }) =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/events`, {
      signal,
    }).then(res =>
      res.json()
    ),
    {
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    })

  const { isLoading: isLoadingReports, error: reportsError, data: reports = [], refetch: refetchReports } = useQuery(['reports'], async ({ signal }) =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/reports`, {
      signal,
    }).then(res =>
      res.json()
    ),
    {
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    })

  //status === 'authenticated' ||
  if (isLoadingUserEvent || isLoadingReports) return <DashboardSkeleton />

  return (
    // <Suspense fallback={<DashboardSkeleton />}>
    <DashboardTabs
      userInfo={[session]}
      userReports={reports}
      userEvent={userEvent?.events}
      missingReportsWithDate={userEvent?.arrDaysWithOutReports}
      refecthFns={{
        refetchUserEvent,
        refetchReports
      }}
    />
    // </Suspense>
  )
}

export default AdminUserPage

export const revalidate = 1
