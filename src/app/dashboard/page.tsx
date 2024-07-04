'use client'

import DashboardTabs from "@/components/dashboardTabs/DashboardTabs"
import { loopThroughDates } from "@/util/reports"
import { useQuery } from "react-query"
import DashboardSkeleton from "@/components/DashboardSkeleton"

const AdminUserPage = () => {

  const { isLoading: isLoadingUserInfo, error: userInfoError, data: userInfo = [], refetch: refetchUserInfo } = useQuery(['userInfo'], async ({ signal }) =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/user`, {
      signal,
    }).then(res =>
      res.json()
    ),
    {
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    })

  const { isLoading: isLoadingUserEvent, error: userEventError, data: userEvent = [], refetch: refetchUserEvent } = useQuery(['userEvent'], async ({ signal }) =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/events`, {
      signal,
    }).then(res =>
      res.json()
    ),
    {
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    })

  const { isLoading: isLoadingReports, error: reportsError, data: reports = [], refetch: refetchReports } = useQuery(['reports'], async ({ signal }) =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/reports`, {
      signal,
    }).then(res =>
      res.json()
    ),
    {
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    })

  if (isLoadingUserInfo || isLoadingUserEvent || isLoadingReports) return <DashboardSkeleton />

  // ? Calculo de reportes faltantes
  const missingUserReports = userEvent?.map((userEvent: any) => {
    return loopThroughDates(userEvent)
  })
  let missingReportsWithDate: any = missingUserReports.flat(1)
  let arrUserEventIds = Array.from(new Set(missingReportsWithDate.map((item: any) => item.userEventId)))
  let uniqueUserEvents = arrUserEventIds.map((item: any) => missingReportsWithDate.filter((item2: any) => item === item2.userEventId))
  // ? ///////////////////////////////////////////////////////////////////////////////////////////////////

  function calculateMondays(startDate: any, today: any, dayWeek: number) {
    let mondays: any = [];
    let startDateRef = startDate

    while (startDateRef.setHours(0, 0, 0, 0).toLocaleString("es-VE") <= today.setHours(0, 0, 0, 0).toLocaleString("es-VE")) {
      if (startDate.getDay() === dayWeek || dayWeek === 0) { // Monday has a weekday value of 1
        mondays.push(new Date(startDateRef)); // Store a copy to avoid modification
      }
      startDateRef.setDate(startDateRef.getDate() + 1); // Move to the next day
    }

    return mondays;
  }

  const weekdays = ["mo", "tu", "we", "th", "fr", "sa", "su"];
  let arrDaysWithOutReports: any = []
  let missingUserReportsV2 = userEvent?.map((userEvent: any) => {
    // if (userEvent.title === 'Santiago Sanchez' && userEvent.byweekday.length > 0) {

      // console.log(userEvent.title)
      let today: any = new Date()
      let startDate: any = new Date(userEvent.start)
      let endDate: any = new Date(userEvent.end)

      // ? cuando byweekday es > a 0 (eventos recurrentes) ==> calculo de dias que deben tener reportes
      let arrDatesOfRecurrenceDays = userEvent.byweekday.map((day: any) => {
        
        let today: any = new Date()
        let startDate: any = new Date(userEvent.start)
        let endDate: any = new Date(userEvent.end)

        let arrayDays = calculateMondays(
          startDate,
          endDate.setHours(0, 0, 0, 0).toLocaleString("es-VE") > today.setHours(0, 0, 0, 0).toLocaleString("es-VE") ?
            today :
            endDate,
          (weekdays.indexOf(day) + 1)
        )
        return arrayDays
      })

      // console.log(arrDatesOfRecurrenceDays)

      let arrDatesOfWithoutRecurrenceDays = []
      // ? cuando byweekday es == a 0 (eventos NO recurrentes) ==> calculo de dias que deben tener reportes
      if (!userEvent.byweekday.length) {
        arrDatesOfWithoutRecurrenceDays = calculateMondays(
          startDate,
          endDate.setHours(0, 0, 0, 0).toLocaleString("es-VE") > today.setHours(0, 0, 0, 0).toLocaleString("es-VE") ?
            today :
            endDate,
          0
        )
      }

      let arrDates = arrDatesOfRecurrenceDays.flat(1).map((date: any) => {
        return date.toLocaleString("es-VE").split(',')[0]
      })

      let arrDates2 = arrDatesOfWithoutRecurrenceDays.map((date: any) => {
        return date.toLocaleString("es-VE").split(',')[0]
      })

      // TODO: Se calculan las fechas que deberian tener reportes en los eventos recurrentes
      // console.log(arrDates)

      //? Evento SIN reporte y ser recurrente (byweekday > 0) y NO ser recurrente (byweekday = 0)
      if (!userEvent.reports.length) {
        // ?  recurrente (byweekday > 0)
        if (userEvent.byweekday.length > 0) {
          // TODO: recorrer las fechas de los reportes del evento y hacer push cuando no se consiga la fecha en el array de fechas arrDates
          arrDates.forEach((date: any) => {
                arrDaysWithOutReports.push({
                  date: date,
                  hasReport: false,
                  userEventTitle: userEvent.title,
                  userEventId: userEvent._id,
                  _asignTo: userEvent._asignTo,
                  patient: userEvent.patient,
                  report: {},
                  byweekday: userEvent.byweekday
                })
          })
        } else {
          let eventsReportsArr = userEvent.reports.map((report:any) => new Date(report.createdAt).toLocaleString("es-VE").split(',')[0])
          console.log(eventsReportsArr)
          // ? NO recurrente (byweekday = 0)
          arrDates2.forEach((date: any) => {
                arrDaysWithOutReports.push({
                  date: date,
                  hasReport: false,
                  userEventTitle: userEvent.title,
                  userEventId: userEvent._id,
                  _asignTo: userEvent._asignTo,
                  patient: userEvent.patient,
                  report: {},
                  byweekday: userEvent.byweekday
                })
          })
        }
      }
      // ? Eventos CON Reportes y ser recurrente (byweekday > 0) y NO ser recurrente (byweekday = 0)
      else {
        console.log(userEvent)
        let eventsReportsArr = userEvent.reports.map((report:any) => new Date(report.createdAt).toLocaleString("es-VE").split(',')[0])

        console.log(eventsReportsArr)
        console.log(arrDates)
        // userEvent?.reports?.forEach((report: any) => {
          // ?  recurrente (byweekday > 0)
          if (userEvent.byweekday.length > 0) {

            arrDates.forEach((dateWithoutReport: any) => {
              if(eventsReportsArr.includes(dateWithoutReport)){
                return 
              }
              arrDaysWithOutReports.push({
                date: dateWithoutReport,
                hasReport: true,
                userEventTitle: userEvent.title,
                userEventId: userEvent._id, // _id del evento
                _asignTo: userEvent._asignTo,
                patient: userEvent.patient,
                report: userEvent.reports,
                byweekday: userEvent.byweekday
              })
            })
            
          }
      }
  })

  return (
    <DashboardTabs
      userInfo={userInfo}
      userReports={reports}
      userEvent={userEvent}
      missingReportsWithDate={arrDaysWithOutReports}
      refecthFns={{
        refetchUserInfo,
        refetchUserEvent
      }}
    />
  )
}

export default AdminUserPage

export const revalidate = 1
