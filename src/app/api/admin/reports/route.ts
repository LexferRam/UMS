import { NextRequest, NextResponse } from "next/server"
import { connectMongoDB } from "@/db/mongodb"
import Report from "@/models/report"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import User from "@/models/user"
import Patient from "@/models/patient"
import mongoose from "mongoose"
import Event from "@/models/event"

// ? Create new report
export async function POST(req: NextRequest) {

    try {

        const session: any = await getServerSession(authOptions)

        const userFound: any = await User.find({ email: session?.user.email }).lean()

        let createdBy = userFound[0]._id.toString();

        const { description, associatedEvent, patient } = await req.json()

        await connectMongoDB()

        const newReport = await Report.create({ description, createdBy: new mongoose.Types.ObjectId(createdBy), associatedEvent: new mongoose.Types.ObjectId(associatedEvent)})

        // ? buscar en Patients usando asignTo
        const patientFound = await Patient.find({ _id: patient })
        const eventFound = await Event.find({ _id: associatedEvent })

        // ? actualizar paciente encontrado en su prop reports con el nuevo reporte
        await patientFound[0]?.reports.push(newReport)
        await patientFound[0].save()

        await eventFound[0]?.reports.push(newReport)
        await eventFound[0].save()

        return NextResponse.json(patientFound, { status: 201 })

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

// ? Get reports by userId
export async function GET(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions)

        const userFound: any = await User.find({ email: session?.user.email }).lean()

        let userId = userFound[0]._id.toString();

        const userReports: any = await Report.find({ createdBy: userId })

        return NextResponse.json(userReports, { status: 201 })
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
