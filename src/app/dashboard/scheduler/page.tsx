import React from 'react'
import SchedulerPage from './_components/SchedulerPage'
import { getEventsForScheduler, getUserSession } from '@/actions'

const page = async () => {
  const session = await getUserSession()
  const events = await getEventsForScheduler()

  return (
    <SchedulerPage
      userInfo={JSON.parse(JSON.stringify(session))}
      events={JSON.stringify(events)}
    />
  )
}

export default page