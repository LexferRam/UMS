'use client'

import React from 'react'

import DashboardSkeleton from './DashboardSkeleton'
import { useUserEvents, useUserReports } from '@/hooks'
import DashboardTabs from './dashboardTabs/DashboardTabs'

const DashboardContainer = ({
  session,
  // userEventInitData,
  // reportsInitData,
}: any) => {

  const {
    isLoadingUserEvent,
    userEventError,
    userEvent,
    refetchUserEvent
  } = useUserEvents()

  const {
    isLoadingReports,
    reportsError,
    reports,
    refetchReports
  } = useUserReports()

  if (userEventError || reportsError) return 'Error por favor recargue...'

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