export const maxDuration = 60;

import mongoose from "mongoose"
import { connectMongoDB } from "@/db/mongodb"
import Event from "@/models/event"
import Patient from "@/models/patient"
import Report from "@/models/report"
import User from "@/models/user"
import { authOptions } from "@/util/authOptions"
import { getDateMinusSevenDays } from "@/util/hours"
import nextAuth, { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(req: NextRequest) {
    try {

        const patientId = req.url.split('/').at(-1)

        // get the new end date of the event
        const { canTakePhoto } = await req.json()

        // connection to DBs
        await connectMongoDB()

        // get the user session, to get the user role
        const session: any = await getServerSession(nextAuth(authOptions))
        const userFound: any = await User.find({ email: session?.user?.email })
        let userRole = userFound[0].role;

        // if the user is not admin return 401 status
        if (userRole !== 'admin') {
            return NextResponse.json({ msg: 'No permission' }, {
                status: 401
            })
        }

        // get the entier event using eventID and update the end date
        let updatedPatient = await Patient.findOneAndUpdate(
            { _id: patientId },
            {
                $set: {
                    canTakePhoto: canTakePhoto
                }
            },
            { new: true }
        )

        return NextResponse.json({
            msg: 'end patient updated'
        })

    } catch (error) {
        console.log(error)
    }
}

export async function POST(req: NextRequest) {
    try {

        const patientId = req.url.split('/').at(-1)

        // get the new end date of the event
        const { isActive } = await req.json()

        // connection to DBs
        await connectMongoDB()

        // get the user session, to get the user role
        const session: any = await getServerSession(nextAuth(authOptions))
        const userFound: any = await User.find({ email: session?.user?.email })
        let userRole = userFound[0].role;

        // if the user is not admin return 401 status
        if (userRole !== 'admin') {
            return NextResponse.json({ msg: 'No permission' }, {
                status: 401
            })
        }

        // get the entier event using eventID and update the end date
        let updatedPatient = await Patient.findOneAndUpdate(
            { _id: patientId },
            {
                $set: {
                    isActive: isActive
                }
            },
            { new: true }
        )

        return NextResponse.json({
            msg: 'end patient updated'
        })

    } catch (error) {
        console.log(error)
    }
}
