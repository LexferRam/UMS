export function verifyReports(startDate: any, endDate: any, reportsArray: any) {
  const missingReports = [];

  // Iterate through each date in the range:
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().slice(0, 10); // Get date in YYYY-MM-DD format

    // Check if there's a report for that date:
    const hasReport = reportsArray.some((report: any) => report.createdAt === dateString);

    if (!hasReport) {
      missingReports.push(dateString);
    }

    // Move to the next day:
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Return the list of missing reports:
  return missingReports;
}

function getWeekday(date: any) {
  const weekdays = ["mo", "tu", "we", "th", "fr", "sa", "su"];
  let dayIndex: any = new Date(date).getDay(); // 0 for Sunday, 1 for Monday, etc.
  return weekdays[dayIndex];
}

function calculateMondays(startDate: any, endDate: any, dayWeek: number) {
  const mondays = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    if (currentDate.getDay() === dayWeek) { // Monday has a weekday value of 1
      mondays.push(new Date(currentDate)); // Store a copy to avoid modification
    }
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  return mondays;
}

export function loopThroughDates(userEvent: any) {

  const weekdays = ["mo", "tu", "we", "th", "fr", "sa", "su"];
  
  let eventStartDate = new Date(userEvent.start);
  let eventEndDate = new Date(userEvent.end)
  let today = new Date()
  let datesArr: any = []

  // ? Calcular la fecha de inicio del evento hasta hoy ó la fecha final del evento
  while (eventStartDate <= (eventEndDate <= today ? eventEndDate : today)) {
    if (userEvent.byweekday.length === 0) {
      datesArr.push({
        date: eventStartDate.toISOString().slice(0, 10),
        hasReport: false
      })
    } else {
      // if (userEvent.title !== 'Santiago Sanchez') return
      let arrDatesOfRecurrenceDays = (calculateMondays(userEvent.start, today, (weekdays.indexOf(userEvent.byweekday[0]) + 1)))

      let datesWithOutReportInRecurrentDays = userEvent.reports.map((item: any) => {
        let itemToPush = arrDatesOfRecurrenceDays.map(itemWithRecu => {
          console.log(itemWithRecu.toISOString().split('T')[0])
          console.log(item.createdAt.split('T')[0])
          return (itemWithRecu.toISOString().split('T')[0] === item.createdAt.split('T')[0]) && itemWithRecu.toISOString().split('T')[0]
        })
        if (!itemToPush[0]) return
        console.log(itemToPush)
        return itemToPush[0]
      })

      console.log(datesWithOutReportInRecurrentDays)
      datesArr.push({
        date: datesWithOutReportInRecurrentDays[0],
        hasReport: false
      })

    }
    eventStartDate.setDate(eventStartDate.getDate() + 1);
  }

  let missingReportByEvents: any = []

  console.log(datesArr)

  datesArr.forEach((itemDate: any) => {
    // ! 1.- Verify if the event has reports
    if (userEvent.reports.length > 0) {
      userEvent.reports.forEach((report: any) => {

        if (itemDate.date === new Date(report.createdAt).toISOString().slice(0, 10)) {

          return missingReportByEvents.push({
            ...itemDate,
            hasReport: true,
            userEventTitle: userEvent.title,
            userEventId: userEvent._id, // _id del evento
            _asignTo: userEvent._asignTo,
            patient: userEvent.patient,
            report: report,
            byweekday: userEvent.byweekday // ! NEWWWWW 
          })
        }
      })
    }
    else {
      if (userEvent.title === 'Rodrigo Sabal') {
        console.log(eventStartDate)
        console.log(today)
        console.log(userEvent)
      }
      // if (userEvent.byweekday.length !== 0 && !userEvent.byweekday.includes(getWeekday(itemDate.date))) return

      return missingReportByEvents.push({
        ...itemDate,
        hasReport: false,
        userEventTitle: userEvent.title,
        userEventId: userEvent._id,
        _asignTo: userEvent._asignTo,
        patient: userEvent.patient,
        report: {},
        byweekday: userEvent.byweekday // ! NEWWWWW 
      })
    }
  }
  )

  const filteredArray = datesArr.filter((element: any) => !missingReportByEvents.some((item: any) => item.date === element.date));

  let datesWithMissingReports = filteredArray.map((itemDate: any) => {
    return {
      ...itemDate,
      hasReport: false,
      userEventTitle: userEvent.title,
      userEventId: userEvent._id,
      _asignTo: userEvent._asignTo,
      patient: userEvent.patient,
      report: {},
      byweekday: userEvent.byweekday
    }
  })

  return !userEvent.reports?.length ? missingReportByEvents : datesWithMissingReports.filter((element: any) => element !== undefined)
}
