
import { connectMongoDB } from "@/db/mongodb"
import Event from "@/models/event"
import Patient from "@/models/patient"
import Report from "@/models/report"
import User from "@/models/user"
import { authOptions } from "@/util/authOptions"
import nextAuth, { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {

    try {

        const session: any = await getServerSession(nextAuth(authOptions))
        const userFound: any = await User.find({ email: session?.user?.email })
        let userRole = userFound[0].role;

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

            return NextResponse.json(updatedUser[0].events)
        }

        await connectMongoDB()
        const events = await Event
            .find()
            .populate({ path: "patient", model: Patient })
            .populate({ path: "_asignTo", model: User })
            .populate({ path: "reports", model: Report })

        
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
        events?.forEach((userEvent: any) => {

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
                            byweekday: userEvent.byweekday
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
                            byweekday: userEvent.byweekday
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
                            byweekday: userEvent.byweekday
                        })
                    })

                }
            }
        })

        return NextResponse.json({arrDaysWithOutReports, events})

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
                const specialistList = await User.find()

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
        await connectMongoDB()
        if (selectedUser === '') {
            events = await Event
                .find()
                .populate({
                    path: "patient", model: Patient, populate: {
                        path: 'reports',
                        model: Report
                    }
                })
                .populate({ path: "_asignTo", model: User })
                .populate({ path: "reports", model: Report })
        } else {
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
        const specialistList = await User.find()

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
