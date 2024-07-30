import DashboardContainer from "@/components/DashboardContainer"
import { getReportsResp, getUserEventsResp, getUserResp } from '@/services/DashboardServices'
import { headers } from "next/headers"

const AdminUserPage = async () => {
  const headersList = headers()
  const cookie = headersList.get('cookie') as any

  const session = await getUserResp(cookie)
  const userEvent = await getUserEventsResp(cookie)
  const reports = await getReportsResp(cookie)

  return (
    <DashboardContainer
      session={session}
      reportsInitData={reports}
      userEventInitData={userEvent}
    />
  )
}

export default AdminUserPage
