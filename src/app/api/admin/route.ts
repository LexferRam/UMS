export const maxDuration = 60;

import { connectMongoDB } from "@/db/mongodb"
import Event from "@/models/event"
import Patient from "@/models/patient"
import Report from "@/models/report"
import User from "@/models/user"
import mongoose from "mongoose"
import { NextApiRequest } from "next"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const secret = process.env.NEXTAUTH_SECRET

export async function GET(req: any) {

    try {

        await connectMongoDB()
        const users = await User.find().populate({
            path: 'asignedPatients',
            model: Patient
        })
        return NextResponse.json(users)

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

// ? create new Event
export async function POST(req: NextRequest) {

    try {

        try {
            const { _creator, _asignTo, title, start, end, patient, eventType, freq, byweekday, reports, recoverEvent, reportOfCancelEventID } = await req.json()
            await connectMongoDB()

            let newEventObject = {
                _creator,
                _asignTo: new mongoose.Types.ObjectId(_asignTo),
                title,
                start,
                end,
                patient,
                eventStatus: true,
                eventType,
                freq,
                byweekday,
                reports
            }

            let newRecoverEvent = {
                ...newEventObject,
                recoverEvent,
                reportOfCancelEventID
            }

            const event = await Event.create(recoverEvent ? newRecoverEvent : newEventObject)

            // ? Buscar user por campo _asignTo
            let userFound = await User.findById({ _id: _asignTo })

            // ? hacer push en su propiedad "events"
            await userFound.events.push(event)

            // ? guardar informacion del nueva del user
            await userFound.save()

            // ? en la prop asignedPatients del userFound filtrar por name de patient
            let existPatient = await userFound.asignedPatients.filter((item: any) => item?.toString() === patient)

            // ? hacer push en su propiedad "patients"
            if (!existPatient.length) {
                await userFound.asignedPatients.push(patient)

                // ? guardar informacion del nueva del user
                await userFound.save()
            }

            if (recoverEvent) {
                let reportFound = await Report.findById({ _id: reportOfCancelEventID })
                await Report.updateOne({ _id: reportOfCancelEventID }, { $set: { hasRecovery: false } });
                await reportFound.recoveredEvents.push(event._id)
                await reportFound.save()
            }

            return NextResponse.json(event, { status: 201 })

        } catch (error) {
            console.log(error)
        }

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