
import { connectMongoDB } from "@/db/mongodb"
import Event from "@/models/event"
import Patient from "@/models/patient"
import Report from "@/models/report"
import User from "@/models/user"
import { authOptions } from "@/util/authOptions"
import nextAuth, { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 60;
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
