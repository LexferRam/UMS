export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server"
import { connectMongoDB } from "@/db/mongodb"
import Report from "@/models/report"
import nextAuth, { getServerSession } from "next-auth"
import User from "@/models/user"
import Patient from "@/models/patient"
import mongoose from "mongoose"
import Event from "@/models/event"
import { authOptions } from "@/util/authOptions"

// Obtener lista de especialistas por paciente
export async function POST(req: NextRequest) {

    try {
        
        const { patientId } = await req.json()
        const specialistList = await User.find()

        await connectMongoDB()

        let listOfSpecialistAssigned = []

        for (let i = 0; i < specialistList.length; i++) {
            const specialist = specialistList[i]
            if (specialist.asignedPatients.map((patient: any) => patient._id.toString()).includes(patientId)) {
                listOfSpecialistAssigned.push(specialist)
            }
        }

        return NextResponse.json(listOfSpecialistAssigned, { status: 201 })

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