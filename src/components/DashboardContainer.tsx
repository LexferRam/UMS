'use client'
import React from 'react'
import { useQuery } from 'react-query'
import DashboardTabs from './dashboardTabs/DashboardTabs'
import { useSession } from 'next-auth/react'

const DashboardContainer = ({
    userEventInitData,
    reportsInitData,
    // session
}: any) => {

    const { data: session, status } = useSession();
    
  const { isLoading: isLoadingUserEvent, error: userEventError, data: userEvent = [], refetch: refetchUserEvent } = useQuery(['userEvent'], async ({ signal }) =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/events`, {
      signal,
    }).then(res =>
      res.json()
    ),
    {
      // keepPreviousData: true,
      // refetchInterval: false,
      refetchOnWindowFocus: true,
      initialData: userEventInitData
    })

  const { isLoading: isLoadingReports, error: reportsError, data: reports = [], refetch: refetchReports } = useQuery(['reports'], async ({ signal }) =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/reports`, {
      signal,
    }).then(res =>
      res.json()
    ),
    {
      // keepPreviousData: true,
      // refetchInterval: false,
      refetchOnWindowFocus: true,
      initialData:reportsInitData
    })
  return (
    <DashboardTabs
    userInfo={[session]}
    userReports={reports}
    userEvent={userEvent?.events}
    missingReportsWithDate={userEvent?.arrDaysWithOutReports}
    refecthFns={{
      // refetchUserEvent,
      // refetchReports
    }}
  />
  )
}

export default DashboardContainer