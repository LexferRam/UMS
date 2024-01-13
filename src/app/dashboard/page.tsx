'use client'

import { headers } from "next/headers"
import DashboardTabs from "@/components/dashboardTabs/DashboardTabs"
import { loopThroughDates } from "@/util/reports"
import { useQuery } from "react-query"
import DashboardSkeleton from "@/components/DashboardSkeleton"

const AdminUserPage = () => {

  const { isLoading: isLoadingUserInfo, error: userInfoError, data: userInfo = [], refetch: refetchUserInfo } = useQuery(['userInfo'], () =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/user`).then(res =>
      res.json()
    ))

  const { isLoading: isLoadingReports, error: reportsError, data: userReports = [], refetch: refetchReports } = useQuery(['userReports'], () =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/reports`).then(res =>
      res.json()
    ))

  const { isLoading: isLoadingUserEvent, error: userEventError, data: userEvent = [], refetch: refetchUserEvent } = useQuery(['userEvent'], () =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/events`).then(res =>
      res.json()
    ))

  if (isLoadingUserInfo || isLoadingReports || isLoadingUserEvent) return <DashboardSkeleton />

  // ? Calculo de reportes faltantes
  const missingUserReports = userEvent?.map((userEvent: any) => {

    let eventStartDate = userEvent.start;
    let eventEndDate = userEvent.end;
    let userReports = userEvent.reports;

    return loopThroughDates(eventStartDate, eventEndDate, userReports, userEvent)
  })
  let missingReportsWithDate: any = missingUserReports.flat(1)

  return (
    <DashboardTabs
      userInfo={userInfo}
      userReports={userReports}
      userEvent={userEvent}
      missingReportsWithDate={missingReportsWithDate}
      refecthFns={{
        refetchUserInfo,
        refetchReports,
        refetchUserEvent
      }}
    />
  )
}

export default AdminUserPage

export const revalidate = 1
