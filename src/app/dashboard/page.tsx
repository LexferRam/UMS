import DashboardContainer from "@/components/DashboardContainer"
import { getReportsResp, getUserEventsResp, getUserResp } from '@/services/DashboardServices'

const AdminUserPage = async () => {

  const session = await getUserResp()
  const userEvent = await getUserEventsResp()
  const reports = await getReportsResp()

  return (
    <DashboardContainer
      session={session}
      reportsInitData={reports}
      userEventInitData={userEvent}
    />
  )
}

export default AdminUserPage
