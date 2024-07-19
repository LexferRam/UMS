'use client'

import React from 'react'
import DashboardTabs from './dashboardTabs/DashboardTabs'
import DashboardSkeleton from './DashboardSkeleton'
import { useUserEvents, useUserReports } from '@/hooks'

const DashboardContainer = ({
  session,
  userEventInitData,
  reportsInitData,
}: any) => {

  const {
    isLoadingUserEvent,
    userEventError,
    userEvent,
    refetchUserEvent
  } = useUserEvents({ userEventInitData })

  const {
    isLoadingReports,
    reportsError,
    reports,
    refetchReports
  } = useUserReports({ reportsInitData })

  if (isLoadingUserEvent || isLoadingReports) return <DashboardSkeleton />

  return (
    <DashboardTabs
      userInfo={session}
      userReports={reports}
      userEvent={userEvent?.events}
      missingReportsWithDate={userEvent?.arrDaysWithOutReports}
      refecthFns={{
        refetchUserEvent,
        refetchReports
      }}
    />
  )
}

export default DashboardContainer