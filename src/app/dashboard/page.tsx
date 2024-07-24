import DashboardContainer from "@/components/DashboardContainer"
import { getReportsResp, getUserEventsResp } from '@/services/DashboardServices'
import { getSession } from "@/util/authOptions"
import { headers } from "next/headers"

const AdminUserPage = async () => {
  const headersList = headers()
  const cookie = headersList.get('cookie') as any

  const session = await getSession()
  const userEvent = await getUserEventsResp(cookie)
  const reports = await getReportsResp(cookie)

  return (
    <DashboardContainer
      session={[session]}
      reportsInitData={reports}
      userEventInitData={userEvent}
    />
  )
}

export default AdminUserPage
