
import { connectMongoDB } from "@/db/mongodb"
import Event from "@/models/event"
import Patient from "@/models/patient"
import Report from "@/models/report"
import User from "@/models/user"
import { authOptions } from "@/util/authOptions"
import nextAuth, { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

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
                    byweekday:selectedDaysArr,
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