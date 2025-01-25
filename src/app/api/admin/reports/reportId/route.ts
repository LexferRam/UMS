export const maxDuration = 60;
import { connectMongoDB } from "@/db/mongodb"
import Patient from "@/models/patient"
import Report from "@/models/report"
import User from "@/models/user"
import nextAuth, { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import models from 'mongoose';
import { authOptions } from "@/util/authOptions"
import Event from "@/models/event"
import mongoose from "mongoose"

// ? get patient by id
export async function GET(req: NextRequest) {

    try {

        const session: any = await getServerSession(nextAuth(authOptions))
        if (!session) return NextResponse.json({ msg: "Not authorized " }, { status: 401 })

        // const { patientId } = await req.query
        const searchParams = req.nextUrl.searchParams;
        const patientId = searchParams.get('patientId');

        await connectMongoDB()

        const patientFound = await Patient.find({ _id: patientId })
            .populate({
                path: 'reports',
                model: Report,
                populate: {
                    path: 'createdBy',
                    model: User
                },
            })
            .populate({
                path: 'reports',
                model: Report,
                populate: {
                    path: 'associatedEvent',
                    model: Event
                }
            })
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

export async function DELETE(req: NextRequest) {
    try {
        const session: any = await getServerSession(nextAuth(authOptions))
        if (!session) return NextResponse.json({ msg: "Not authorized " }, { status: 401 })

        const { reportId, eventId } = await req.json()

        await connectMongoDB()

        let reportToDelete = await Report.find({ _id: reportId })

        // if the report has associated recovered Events then we can not be able to delete the report
        if(reportToDelete.length > 0 && reportToDelete[0]?.recoveredEvents.length > 0) {
            return NextResponse.json(
                { msg: 'El reporte no puede ser eliminado porque el evento cancelado tiene citas de recuperación asociadas' },
                { status: 403 }
            )
        }

        let events: any = await Event.find({ _id: eventId })
        await Event.findOneAndUpdate(
            { _id: eventId },
            {
                $set: {
                    reports: events[0].reports.filter((report: any) => String(report) != reportId)
                }
            },
            { new: true })
        
        let patient: any = await Patient.find({ _id: events[0].patient })
        await Patient.findOneAndUpdate(
            { _id: events[0].patient },
            {
                $set: {
                    reports: patient[0].reports.filter((report: any) => String(report) != reportId)
                }
            },
            { new: true })

        // delete report
        await Report.findByIdAndDelete(reportId)

        return NextResponse.json({ msg: 'Report deleted' }, { status: 201 })

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
