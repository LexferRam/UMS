
import { connectMongoDB } from "@/db/mongodb"
import Event from "@/models/event"
import Patient from "@/models/patient"
import Report from "@/models/report"
import User from "@/models/user"
import { authOptions } from "@/util/authOptions"
import nextAuth, { getServerSession } from "next-auth"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const secret = process.env.NEXTAUTH_SECRET

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