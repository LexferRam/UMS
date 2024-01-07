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

        const { description, associatedEvent, patient, createdAt } = await req.json()

        await connectMongoDB()

        let missingReportObject = {
            description,
            createdBy: new mongoose.Types.ObjectId(createdBy),
            associatedEvent,
            patient: patient,
            createdAt: createdAt
        }

        let reportObject = {
            description,
            createdBy: new mongoose.Types.ObjectId(createdBy),
            associatedEvent,
            patient: patient
        }

        const newReport = await Report.create(createdAt ? missingReportObject : reportObject)

        // console.log(newReport)
        // return
        console.log(createdAt ? missingReportObject : reportObject)
        console.log(associatedEvent)

        // ? buscar en Patient usando asignTo
        const patientFound = await Patient.find({ _id: patient })
        const eventFound = await Event.find({ _id: associatedEvent })

        console.log(patientFound)
        console.log(eventFound)

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

        // ? si es admin se devuelven todos los reportes
        if (userFound[0].role === 'admin') {
            const userReports: any = await Report.find()
                .populate({
                    path: 'createdBy',
                    model: User
                })
                .populate({
                    path: 'associatedEvent',
                    model: Event,
                    populate: {
                        path: 'patient',
                        model: Patient
                    }
                }).sort({ createdAt: -1 })
            
            return NextResponse.json(userReports, { status: 201 })
        } else {
            const userReports: any = await Report.find({ createdBy: userId })
                .populate({
                    path: 'createdBy',
                    model: User
                }).
                populate({
                    path: 'associatedEvent',
                    model: Event,
                    populate: {
                        path: 'patient',
                        model: Patient
                    }
                }).sort({ createdAt: -1 })
            

            return NextResponse.json(userReports, { status: 201 })
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
