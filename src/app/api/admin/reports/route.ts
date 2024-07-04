import { NextRequest, NextResponse } from "next/server"
import { connectMongoDB } from "@/db/mongodb"
import Report from "@/models/report"
import nextAuth, { getServerSession } from "next-auth"
import User from "@/models/user"
import Patient from "@/models/patient"
import mongoose from "mongoose"
import Event from "@/models/event"
import { authOptions } from "@/util/authOptions"

// ? Create new report
export async function POST(req: NextRequest) {

    try {

        const session: any = await getServerSession(nextAuth(authOptions))

        const userFound: any = await User.find({ email: session?.user.email }).lean()

        let createdBy = userFound[0]._id.toString();

        const { description, associatedEvent, patient, createdAt, isForEventCancel, hasRecovery } = await req.json()

        await connectMongoDB()

        let missingReportObject = {
            description,
            createdBy: new mongoose.Types.ObjectId(createdBy),
            associatedEvent,
            patient: patient,
            createdAt: createdAt,
            isForEventCancel: isForEventCancel,
            hasRecovery: true
        }

        let reportObject = {
            description,
            createdBy: new mongoose.Types.ObjectId(createdBy),
            associatedEvent,
            patient: patient,
            isForEventCancel: isForEventCancel,
            hasRecovery: hasRecovery
        }

        let reportObjectToCreate = createdAt ? missingReportObject : reportObject

        const newReport = await Report.create(reportObjectToCreate)
        console.log(newReport)

        // ? buscar en Patient usando asignTo
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
                    populate: [
                        {
                            path: 'patient',
                            model: Patient
                        },
                        {
                            path: '_asignTo',
                            model: User
                        }]
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
