import { getEvents, getReports, getUserSession } from "@/actions"
import DashboardContainer from "@/components/DashboardContainer"

export default async function AdminUserPage(){

  const session = await getUserSession()
  const userEvent = await getEvents()
  const reports = await getReports()

  return (
    <DashboardContainer
      session={JSON.stringify(session)}
      userEventInitData={JSON.stringify(userEvent)}
      reportsInitData={JSON.stringify(reports)}
    />
  )
}
