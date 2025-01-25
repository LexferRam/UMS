export const maxDuration = 60;
import mongoose from "mongoose"
import { connectMongoDB } from "@/db/mongodb"
import Event from "@/models/event"
import Patient from "@/models/patient"
import Report from "@/models/report"
import User from "@/models/user"
import { authOptions } from "@/util/authOptions"
import { getDateMinusSevenDays } from "@/util/hours"
import nextAuth, { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

//Api de actualizacion de eventos
export async function POST(req: NextRequest) {

    try {

        const {
            title,
            start,
            end,
            _asignTo,
            patient,
            selectedDaysArr,
            eventType
        } = await req.json()

        const eventId = req.url.split('/').at(-1)

        const session: any = await getServerSession(nextAuth(authOptions))
        const userFound: any = await User.find({ email: session?.user?.email })
        let userRole = userFound[0].role;

        // ? PARA EL USUARIO ESPECIALISTA
        if (userRole !== 'admin') {
            return NextResponse.json({ msg: 'No permission' }, {
                status: 401
            })
        }

        // ? PARA EL USUARIO ADMIN
        await connectMongoDB()
        
        let updatedEvent = await Event.findOneAndUpdate(
            { _id: eventId },
            {
                $set: {
                    title,
                    start,
                    end, 
                    _asignTo,
                    patient,
                    byweekday: selectedDaysArr,
                    eventType
                }
            },
            { new: true })

        let newEvent = await Event
            .findById({ _id: eventId })
            .populate({ path: "patient", model: Patient })
            .populate({ path: "_asignTo", model: User })
            .populate({ path: "reports", model: Report })

        return NextResponse.json(newEvent)

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

// Api que elimina evento a partir de uno seleccionado
export async function PUT(req: NextRequest) {
    try {

        // get the new end date of the event
        const { newEndDate, _id } = await req.json()

        // connection to DBs
        await connectMongoDB()

        // get the user session, to get the user role
        const session: any = await getServerSession(nextAuth(authOptions))
        const userFound: any = await User.find({ email: session?.user?.email })
        let userRole = userFound[0].role;

        // if the user is not admin return 401 status
        if (userRole !== 'admin') {
            return NextResponse.json({ msg: 'No permission' }, {
                status: 401
            })
        }

        // get the entier event using eventID
        let foundEvent = await Event.find({ _id })

        let eventEndHour = foundEvent[0]?.end.getUTCHours() > 9 ? foundEvent[0].end.getUTCHours() : '0' + foundEvent[0].end.getUTCHours()
        let eventEndMinute = foundEvent[0]?.end.getUTCMinutes() > 9 ? foundEvent[0].end.getUTCMinutes() : '0' + foundEvent[0].end.getUTCMinutes()

        // get the entier event using eventID and update the end date
        let updatedEvent = await Event.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    end: getDateMinusSevenDays(newEndDate.split('T')[0]) + 'T' + eventEndHour + ':' + eventEndMinute + ':00.000Z',
                }
            },
            { new: true }
        )

        return NextResponse.json({
            msg: 'end date updated'
        })

    } catch (error) {
        console.log(error)
    }
}

export async function DELETE(req: NextRequest) {
    try {

        const eventId = req.url.split('/').at(-1)

        await connectMongoDB()

        const session: any = await getServerSession(nextAuth(authOptions))
        const userFound: any = await User.find({ email: session?.user?.email })
        let userRole = userFound[0].role;

        if (userRole !== 'admin') {
            return NextResponse.json({ msg: 'No permission' }, {
                status: 401
            })
        }

        // look for event ID
        let eventFound = await Event.findById({ _id: eventId })

        // si es un evento de recuperacion, se busca el reporte asociado por id
        if (eventFound.recoverEvent) {
            let reportOfEventCancelled = await Report.findById({ _id: eventFound?.reportOfCancelEventID })
            await Report.findByIdAndUpdate(
                { _id: eventFound?.reportOfCancelEventID },
                {
                    recoveredEvents: reportOfEventCancelled.recoveredEvents.filter((event: any) => String(event) != String(eventFound._id))
                }
            )
            let reportOfEventCancelledWithRepostUpdated = await Report.findById({ _id: eventFound?.reportOfCancelEventID })
            await Report.findByIdAndUpdate(
                { _id: eventFound?.reportOfCancelEventID },
                {
                    hasRecovery: reportOfEventCancelledWithRepostUpdated?.recoveredEvents?.length > 0 ? false : true
                }
            )
        }

        let deletedEvent = await Event.findOneAndDelete({ _id: eventId })

        // ? INICIO de LOGICA: para eliminar un paciente asignado al especialista
        // 1. tomar el id del paciente asignado en la cita eliminada
        let patientOfTheDeletedEvent = deletedEvent.patient
        // 2. buscar si el especialista tiene otro evento con éste paciente
        let userOfTheDeletedEvent: any = await User.find({ _id: deletedEvent?._asignTo }).populate({
            path: 'events',
            model: Event,
        })
        let userEvents = await userOfTheDeletedEvent.length ? userOfTheDeletedEvent[0]?.events : userOfTheDeletedEvent
        // recorro todos los eventos y preguntar si algun evento tiene al paciente
        let eventHasPatientId = await userEvents?.map((userEvent: any) => userEvent?.patient).find((item: any) => item?.toString() === patientOfTheDeletedEvent._id.toString())

        let userAssignPatients = await userOfTheDeletedEvent[0]?.asignedPatients?.map((patient: any) => patient._id?.toString())
        if(!eventHasPatientId){
            // 3. si NO tiene otra cita con éste paciente, eliminar ese paciente del especialista
            console.log('NO hay otro evento con este paciente, ELIMINAR')
            await User.findByIdAndUpdate(
                { _id: deletedEvent?._asignTo },
                {
                    asignedPatients: userAssignPatients.filter((patient: any) => patient != patientOfTheDeletedEvent._id?.toString())
                }
            )
        }
        // ? FIN de LOGICA: para eliminar un paciente asignado al especialista
        
        // delete the event from the user in the property events
        let user = await User.findOne({ _id: deletedEvent._asignTo })
        user.events = await user.events.filter((event: any) => event != eventId)
        await user.save()

        return NextResponse.json({ msg: 'Cita eliminada exitosamenete' })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ msg: 'Error eliminando Cita' })
    }
}