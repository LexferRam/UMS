// import { getServerSession } from "next-auth"
import { headers } from "next/headers"
import DashboardTabs from "@/components/dashboardTabs/DashboardTabs"

const AdminUserPage = async () => {

  // const session = await getServerSession(authOptions)
  const respUser = await fetch('http://localhost:3000/api/admin/user', {
    method: "GET",
    headers: headers()
  }
  )
  let userInfo = await respUser.json()

  return (
    <>
      <DashboardTabs userInfo={userInfo} />
    </>
  )
}

export default AdminUserPage