// import { getServerSession } from "next-auth"
import { headers } from "next/headers"
import DashboardTabs from "@/components/dashboardTabs/DashboardTabs"

const AdminUserPage = async () => {

  // TODO: pasar consultas del lado del cliente (react query)
  // const session = await getServerSession(authOptions)
  const respUser = await fetch('http://localhost:3000/api/admin/user', {
    method: "GET",
    headers: headers(),
    next:{
      revalidate: 1 // revalidate after 10 seconds ==>  ISR
  }})

  const userReportsResp = await fetch('http://localhost:3000/api/admin/reports', {
    method: "GET",
    headers: headers(),
    next:{
      revalidate: 1 // revalidate after 10 seconds ==>  ISR
  }})

  // let respEvents = await fetch('http://localhost:3000/api/admin/events')

  const userRespEvents = await fetch('http://localhost:3000/api/admin/events', {
    method: "GET",
    headers: headers(),
    next:{
      revalidate: 1 // revalidate after 10 seconds ==>  ISR
  }})

  let userInfo = await respUser.json()
  let userReports = await userReportsResp.json()
  let userEvent = await userRespEvents.json()

  console.log(userInfo)

  return (
    <>
      <DashboardTabs userInfo={userInfo} userReports={userReports} userEvent={userEvent} />
    </>
  )
}

export default AdminUserPage

export const revalidate = 1  