import { connectMongoDB } from "@/db/mongodb"
import User from "@/models/user"
import { NextApiRequest } from "next"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const secret = process.env.NEXTAUTH_SECRET

export async function POST(req: NextRequest) {
    // const token = await getToken({ req, secret })

    // if(!token) return NextResponse.json([])

    const { email } = await req.json()
    await connectMongoDB()
    let userFound = await User.find({ email }).populate("events").populate("asignedPatients")
    return NextResponse.json(userFound, { status: 201 })
}

export async function GET(req: NextApiRequest) {

    try {

        const token = await getToken({ req, secret })

        await connectMongoDB()
        const userFound = await User.find({ email: token?.email }).populate('events').populate('asignedPatients')
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