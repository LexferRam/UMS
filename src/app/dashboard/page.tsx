// import { getServerSession } from "next-auth"
import { headers } from "next/headers"
import DashboardTabs from "@/components/dashboardTabs/DashboardTabs"

const AdminUserPage = async () => {

  // const session = await getServerSession(authOptions)
  const respUser = await fetch('http://localhost:3000/api/admin/user', {
    method: "GET",
    headers: headers(),
    next:{
      revalidate: 1 // revalidate after 10 seconds ==>  ISR
  }
  })

  const userReportsResp = await fetch('http://localhost:3000/api/admin/reports', {
    method: "GET",
    headers: headers(),
    next:{
      revalidate: 1 // revalidate after 10 seconds ==>  ISR
  }
  })

  let userReports = await userReportsResp.json()
  let userInfo = await respUser.json()

  return (
    <>
      <DashboardTabs userInfo={userInfo} userReports={userReports} />
    </>
  )
}

export default AdminUserPage

export const revalidate = 1  