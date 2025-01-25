export const maxDuration = 60;
import { connectMongoDB } from "@/db/mongodb"
import User from "@/models/user"
import { NextApiRequest, NextApiResponse } from "next"
import nextAuth, { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import Event from "@/models/event"
import Patient from "@/models/patient"
import Report from "@/models/report"
import { authOptions } from "@/util/authOptions"

const secret = process.env.NEXTAUTH_SECRET

// ? API to get user info
export async function GET(req: any, res: NextApiResponse) {

    try {

        const session: any = await getServerSession(nextAuth(authOptions))
        await connectMongoDB()

        const userFound = await User
            .find({ email: session?.user.email })
            .populate({
                path: 'events',
                model: Event,
                populate: {
                    path: 'patient',
                    model: Patient,
                    populate: {
                        path: 'reports',
                        model: Report
                    }
                }
            })
            .populate({
                path: 'asignedPatients',
                model: Patient
            })

        return NextResponse.json(userFound, { status: 201 })

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