// import { getServerSession } from "next-auth"
import { headers } from "next/headers"
import DashboardTabs from "@/components/dashboardTabs/DashboardTabs"
import { loopThroughDates, verifyReports } from "@/util/reports"

const AdminUserPage = async () => {

  // TODO: pasar consultas del lado del cliente (react query)
  // const session = await getServerSession(authOptions)
  const respUser = await fetch('http://localhost:3000/api/admin/user', {
    method: "GET",
    headers: headers(),
    next: {
      revalidate: 1 // revalidate after 10 seconds ==>  ISR
    }
  })

  const userReportsResp = await fetch('http://localhost:3000/api/admin/reports', {
    method: "GET",
    headers: headers(),
    next: {
      revalidate: 1 // revalidate after 10 seconds ==>  ISR
    }
  })

  // let respEvents = await fetch('http://localhost:3000/api/admin/events')

  const userRespEvents = await fetch('http://localhost:3000/api/admin/events', {
    method: "GET",
    headers: headers(),
    next: {
      revalidate: 1 // revalidate after 10 seconds ==>  ISR
    }
  })

  let userInfo = await respUser.json()
  let userReports = await userReportsResp.json()
  let userEvent = await userRespEvents.json()

  // TODO: recorrer todos los eventos del usuario
  const missingUserReports = userEvent.map((userEvent: any) => {

    let eventStartDate = userEvent.start;
    let eventEndDate = userEvent.end;
    let userReports = userEvent.reports;

    console.log(userEvent.patient)

    return loopThroughDates(eventStartDate, eventEndDate, userReports, userEvent)
  })

  let missingReportsWithDate: any = missingUserReports.flat(1)

  return (
    <DashboardTabs
      userInfo={userInfo}
      userReports={userReports}
      userEvent={userEvent}
      missingReportsWithDate={missingReportsWithDate}
    />
  )
}

export default AdminUserPage

export const revalidate = 1  