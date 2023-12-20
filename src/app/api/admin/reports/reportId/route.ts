import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectMongoDB } from "@/db/mongodb"
import Patient from "@/models/patient"
import Report from "@/models/report"
import User from "@/models/user"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import models from 'mongoose';

// ? get patient by id
export async function GET(req: NextRequest) {

    try {

        const session: any = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ msg: "Not authorized " }, { status: 401 })

        // const { patientId } = await req.query
        const searchParams = req.nextUrl.searchParams;
        const patientId = searchParams.get('patientId');

        await connectMongoDB()

        const patientFound = await Patient.find({ _id: patientId }).populate({path:'reports', model: Report, populate:{
            path: 'createdBy',
            model: User
        }})

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