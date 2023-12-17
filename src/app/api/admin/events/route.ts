
import { connectMongoDB } from "@/db/mongodb"
import Event from "@/models/event"
import User from "@/models/user"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const secret = process.env.NEXTAUTH_SECRET

export async function GET(req: NextRequest) {

    try {

        const token = await getToken({ req, secret })

        // TODO: Validar con el role del usuario
        if(token?.email !== 'lexferramirez@gmail.com') {
            await connectMongoDB()
            let updatedUser = await User.find({ email: token?.email }).populate("events")

            return NextResponse.json(updatedUser[0].events)
        }

        await connectMongoDB()
        const events = await Event.find()
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