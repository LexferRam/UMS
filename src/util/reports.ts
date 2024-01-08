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
  const weekdays = [ "mo", "tu", "we", "th", "fr", "sa","su"];
  let dayIndex: any =new Date(date).getDay(); // 0 for Sunday, 1 for Monday, etc.
  return weekdays[dayIndex];
}

export function loopThroughDates(startDate: any, endDate: any, reportsArr: any, userEvent: any) {
  let currentDate = new Date(startDate);
  let endDateFormatted = new Date(endDate)
  let today = new Date()
  let datesArr: any = []

  while (currentDate <= (endDateFormatted <= today ? endDateFormatted : today)) {
    datesArr.push({
      date: currentDate.toISOString().slice(0, 10),
      hasReport: false
    })
    currentDate.setDate(currentDate.getDate() + 1);
  }

  let missingReportByEvents: any = []

  datesArr.forEach((itemDate: any) => {
    if (reportsArr.length > 0) {
      reportsArr.forEach((report: any) => {

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

      if (userEvent.byweekday.length !== 0 && !userEvent.byweekday.includes(getWeekday(itemDate.date))) return

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

  return !reportsArr?.length ? missingReportByEvents : datesWithMissingReports.filter((element: any) => element !== undefined)
}
