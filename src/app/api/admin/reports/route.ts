import { NextRequest, NextResponse } from "next/server"
import { connectMongoDB } from "@/db/mongodb"
import Report from "@/models/report"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import User from "@/models/user"

// ? Create new report
export async function POST(req: NextRequest) {

    try {

        const session = await getServerSession(authOptions)
        console.log(session)

        const userFound = await User.find({ email: session?.user.email }).lean() 
        // console.log(userFound[0]._id.toString())

        let createdBy = userFound[0]._id.toString()

        const { description, associatedEvent } = await req.json()
        await connectMongoDB()

        const newReport = await Report.create({ description, createdBy, associatedEvent })

        return NextResponse.json(newReport, { status: 201 })

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