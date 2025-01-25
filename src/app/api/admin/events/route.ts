export const maxDuration = 60;
import { connectMongoDB } from "@/db/mongodb"
import Event from "@/models/event"
import Patient from "@/models/patient"
import Report from "@/models/report"
import User from "@/models/user"
import { authOptions } from "@/util/authOptions"
import nextAuth, { getServerSession } from "next-auth"
import { getSession } from "next-auth/react"
import { NextRequest, NextResponse } from "next/server"
import moment from "moment";

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

function isDateWithinRange(today: any, startDate: any, endDate: any, event: any) {
    today = today.setHours(0, 0, 0, 0).toLocaleString("es-VE")

    // const today3 = new Intl.DateTimeFormat('en-US', {
    //     year: "numeric",
    //     month: "numeric",
    //     day: "numeric",
    //     hour: "numeric",
    //     minute: "numeric",
    //     second: "numeric",
    //     hour12: true,
    //     timeZone: 'America/Caracas'
    // }).format(startDate)

    //   const today4 = new Date(today3)

    // console.log(startDate)
    // console.log(today3)
    // console.log(today4)
    startDate = new Date(startDate).setHours(0, 0, 0, 0).toLocaleString("es-VE")
    endDate = new Date(endDate).setHours(0, 0, 0, 0).toLocaleString("es-VE")

    return today >= startDate && today <= endDate;
}

const eventForToday = (eventsArray: any) => {
    let daysWeek: any = {
        mo: 1,
        tu: 2,
        we: 3,
        th: 4,
        fr: 5,
        sa: 6,
        su: 7
    }

    let eventsForTodayArray: any[] = []

    eventsArray?.map((event: any) => {

        ////**** */
        const today2 = new Intl.DateTimeFormat('en-US', {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
            timeZone: 'America/Caracas'
        }).format(new Date())

        const today = new Date(today2)
        ////**** */
        if (event.byweekday.length > 0) {
            event.byweekday.forEach((dayWeek: any) => {
                if (daysWeek[dayWeek] === today.getDay()) {
                    isDateWithinRange(today, event.start, event.end, event) && eventsForTodayArray.push(event)
                }
            })
        }
        if (event.byweekday.length === 0) {
            isDateWithinRange(today, event.start, event.end, event) && eventsForTodayArray.push(event)
        }
    })

    return eventsForTodayArray
}

export async function GET(req: NextRequest, res: any) {

    try {
        await connectMongoDB()
        const session: any = await getServerSession(nextAuth(authOptions))
        const userFound: any = await User.find({ email: session?.user?.email })
        let userRole = userFound[0]?.role;

        // TODO: Validar con el role del usuario
        if (userRole !== 'admin') {
            await connectMongoDB()
            let updatedUser = await User
                .find({ email: session?.user.email })
                .populate({
                    path: "events",
                    model: Event,
                    populate: [
                        {
                            path: 'patient',
                            model: Patient
                        },
                        {
                            path: '_asignTo',
                            model: User
                        },
                        {
                            path: 'reports',
                            model: Report
                        }
                    ]
                })
        
                let arrDaysWithOutReports: any = []
                updatedUser[0].events?.forEach((userEvent: any) => {
        
                    ////**** */
                    const today2 = new Intl.DateTimeFormat('en-US', {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                        hour12: true,
                        timeZone: 'America/Caracas'
                    }).format(new Date())

                    const today = new Date(today2)
                    ////**** */

                    let startDate: any = new Date(userEvent.start)
                    let endDate: any = new Date(userEvent.end)
        
                    // ? cuando byweekday es > a 0 (eventos recurrentes) ==> calculo de dias que deben tener reportes
                    let arrDatesOfRecurrenceDays = userEvent.byweekday.map((day: any) => {
        
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
                                    byweekday: userEvent.byweekday,
                                    eventType: userEvent.eventType
                                })
                            })
                        } else {
                            let eventsReportsArr = userEvent.reports.map((report: any) => new Date(report.createdAt).toLocaleString("es-VE").split(',')[0])
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
                                    byweekday: userEvent.byweekday,
                                    eventType: userEvent.eventType
                                })
                            })
                        }
                    }
                    // ? Eventos CON Reportes y ser recurrente (byweekday > 0) y NO ser recurrente (byweekday = 0)
                    else {
                        let eventsReportsArr = userEvent.reports.map((report: any) => new Date(report.createdAt).toLocaleString("es-VE").split(',')[0])
        
                        // ?  recurrente (byweekday > 0)
                        if (userEvent.byweekday.length > 0) {
        
                            arrDates.forEach((dateWithoutReport: any) => {
                                if (eventsReportsArr.includes(dateWithoutReport)) {
                                    return
                                }
                                arrDaysWithOutReports.push({
                                    date: dateWithoutReport,
                                    hasReport: true,
                                    userEventTitle: userEvent.title,
                                    userEventId: userEvent._id,
                                    _asignTo: userEvent._asignTo,
                                    patient: userEvent.patient,
                                    report: userEvent.reports,
                                    byweekday: userEvent.byweekday,
                                    eventType: userEvent.eventType
                                })
                            })
        
                        }
                    }
                })

            return NextResponse.json({arrDaysWithOutReports, events: eventForToday(updatedUser[0]?.events)}) 
        }

        await connectMongoDB()
        const events = await Event
            .find()
            .populate({ path: "patient", model: Patient })
            .populate({ path: "_asignTo", model: User })
            .populate({ path: "reports", model: Report })
    
            let arrDaysWithOutReports: any = []
            events?.forEach((userEvent: any) => {
    
                ////**** */
                const today2 = new Intl.DateTimeFormat('en-US', {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                    timeZone: 'America/Caracas'
                }).format(new Date())

                const today = new Date(today2)
                ////**** */
                let startDate: any = new Date(userEvent.start)
                let endDate: any = new Date(userEvent.end)
    
                // ? cuando byweekday es > a 0 (eventos recurrentes) ==> calculo de dias que deben tener reportes
                let arrDatesOfRecurrenceDays = userEvent.byweekday.map((day: any) => {
    
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
                                byweekday: userEvent.byweekday,
                                eventType: userEvent.eventType
                            })
                        })
                    } else {
                        let eventsReportsArr = userEvent.reports.map((report: any) => new Date(report.createdAt).toLocaleString("es-VE").split(',')[0])
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
                                byweekday: userEvent.byweekday,
                                eventType: userEvent.eventType
                            })
                        })
                    }
                }
                // ? Eventos CON Reportes y ser recurrente (byweekday > 0) y NO ser recurrente (byweekday = 0)
                else {
                    let eventsReportsArr = userEvent.reports.map((report: any) => new Date(report.createdAt).toLocaleString("es-VE").split(',')[0])
    
                    // ?  recurrente (byweekday > 0)
                    if (userEvent.byweekday.length > 0) {
    
                        arrDates.forEach((dateWithoutReport: any) => {
                            if (eventsReportsArr.includes(dateWithoutReport)) {
                                return
                            }
                            arrDaysWithOutReports.push({
                                date: dateWithoutReport,
                                hasReport: true,
                                userEventTitle: userEvent.title,
                                userEventId: userEvent._id,
                                _asignTo: userEvent._asignTo,
                                patient: userEvent.patient,
                                report: userEvent.reports,
                                byweekday: userEvent.byweekday,
                                eventType: userEvent.eventType
                            })
                        })
    
                    }
                }
            })
    
            return NextResponse.json({arrDaysWithOutReports, events: eventForToday(events)})

    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            return NextResponse.json({
                message: error.message
            }, {
                status: 400
            })
        }
    }
}

export async function POST(req: NextRequest) {

    try {
        const { selectedUser } = await req.json()

        const session: any = await getServerSession(nextAuth(authOptions))
        await connectMongoDB()
        const userFound: any = await User.find({ email: session?.user?.email })
        let userRole = userFound[0].role;

        // ? PARA EL USUARIO ESPECIALISTA
        if (userRole !== 'admin') {
            await connectMongoDB()
            let updatedUser = await User
                .find({ email: session?.user.email })
                .populate({
                    path: "events",
                    model: Event,
                    populate: [
                        {
                            path: 'patient',
                            model: Patient
                        },
                        {
                            path: '_asignTo',
                            model: User
                        },
                        {
                            path: 'reports',
                            model: Report
                        }
                    ]
                })
                
                let patientsIds = updatedUser[0].events.map((event: any) => ({patientId: event.patient._id.toString(), eventId: event._id.toString()}))
                const specialistList = await User.find().populate({path: 'events', model: Event})

                let patientListWithSpecialistList = patientsIds.map(({patientId, eventId}: any) => {
                    let specialistAssigned = []
                    for (let i = 0; i < specialistList.length; i++) {
                        if (specialistList[i].asignedPatients.map((patient: any) => patient._id.toString()).includes(patientId)) {
                            specialistAssigned.push(specialistList[i])
                        }
                    }
                    return {
                        eventId,
                        patientId,
                        specialistAssigned
                    }
                })
                
               let eventsWithPatientAndAssignedSpecialist = updatedUser[0].events = updatedUser[0].events.map((event: any) => {
                    let specialistAssigned = patientListWithSpecialistList.find(({patientId, eventId}: any) => patientId === event.patient._id.toString() && eventId === event._id.toString())
                    return {
                        ...event._doc,
                        patient: {
                            ...event.patient._doc,
                            specialistAssigned: specialistAssigned?.specialistAssigned
                        }
                    }
                })


            return NextResponse.json(eventsWithPatientAndAssignedSpecialist)
        }

        // ? PARA EL USUARIO ADMIN
        let events
        if (selectedUser === '') {
            const twoWeeksAgo = moment().subtract(1, 'weeks');
            const fourWeeksFromNow = moment().add(1, 'weeks');

            const startOfTwoWeeksAgo = twoWeeksAgo.startOf('isoWeek').toDate();
            const endOfFourWeeksFromNow = fourWeeksFromNow.endOf('isoWeek').toDate();
            const startDate = new Date('2024-12-01T00:00:00.000Z');

            await connectMongoDB()
            events = await Event
                .find({ start: { $gt: startDate } })
                // .find({
                    // $or: [
                    //     { end: { $gt: startOfTwoWeeksAgo } },
                    //     { end: { $gt: endOfFourWeeksFromNow } }
                    // ]
                // })
                .populate({
                    path: "patient", model: Patient, populate: {
                        path: 'reports',
                        model: Report
                    }
                })
                .populate({ path: "_asignTo", model: User })
                .populate({ path: "reports", model: Report })
        } else {
            await connectMongoDB()
            events = await Event
                .find({ _asignTo: selectedUser })
                .populate({
                    path: "patient", model: Patient, populate: {
                        path: 'reports',
                        model: Report
                    }
                })
                .populate({ path: "_asignTo", model: User })
                .populate({ path: "reports", model: Report })
        }

        // ?: agregar especialistas asignados a cada paciente
        let patientsIds = events.map((event: any) => event.patient._id.toString())
        await connectMongoDB()
        const specialistList = await User.find().populate({path: 'events', model: Event})

        let patientListWithSpecialistList = patientsIds.map((patientId: any) => {
            let specialistAssigned = []
            for (let i = 0; i < specialistList.length; i++) {
                if (specialistList[i].asignedPatients.map((patient: any) => patient._id.toString()).includes(patientId)) {
                    specialistAssigned.push(specialistList[i])
                }
            }
            return {
                patientId,
                specialistAssigned
            }
        })

        // agrupar patientListWithSpecialistList con events a la propiedad patient._id
        events = events.map((event: any) => {
            let specialistAssigned = patientListWithSpecialistList.find((patient: any) => patient.patientId === event.patient._id.toString())
            return {
                ...event._doc,
                patient: {
                    ...event.patient._doc,
                    specialistAssigned: specialistAssigned?.specialistAssigned
                }
            }
        })

        return NextResponse.json(events)

    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            return NextResponse.json({
                message: error.message
            }, {
                status: 400
            })
        }
    }
}
