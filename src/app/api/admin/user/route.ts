import { connectMongoDB } from "@/db/mongodb"
import User from "@/models/user"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"
import Event from "@/models/event"
import Patient from "@/models/patient"

const secret = process.env.NEXTAUTH_SECRET

export async function POST(req: NextRequest) {
    // const token = await getToken({ req, secret })

    // if(!token) return NextResponse.json([])

    const { email } = await req.json()
    await connectMongoDB()
    let userFound = await User.find({ email }).populate({path:"events", model: Event}).populate({path:"asignedPatients", model: Patient})

    return NextResponse.json(userFound, { status: 201 })
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {

    try {

        const session:any = await getServerSession(authOptions)
        await connectMongoDB()

        const userFound = await User.find({ email: session?.user.email }).populate({path:'events', model:Event,populate:{
            path: 'patient',
            model: Patient
        }}).populate({path:'asignedPatients', model:Patient})

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