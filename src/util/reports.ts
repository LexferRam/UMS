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

    if(reportsArr.length > 0){
      reportsArr.forEach((report: any) => {

        if (itemDate.date === new Date(report.createdAt).toISOString().slice(0, 10)) {
         return missingReportByEvents.push({
            ...itemDate,
            hasReport: true,
            userEventTitle: userEvent.title,
            userEventId: userEvent._id,
            _asignTo: userEvent._asignTo.name,
            patient: userEvent.patient.name,
            report: report
          })
        } 
        else {
          return missingReportByEvents.push({
            ...itemDate,
            hasReport: false,
            userEventTitle: userEvent.title,
            userEventId: userEvent._id,
            _asignTo: userEvent._asignTo.name,
            patient: userEvent.patient.name
          })
        }
  
      })
    }
    else{
      return missingReportByEvents.push({
        ...itemDate,
        hasReport: false,
        userEventTitle: userEvent.title,
        userEventId: userEvent._id,
        _asignTo: userEvent._asignTo.name,
        patient: userEvent.patient.name
      })
    }


  })

  return missingReportByEvents
}
