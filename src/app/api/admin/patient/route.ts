import { NextRequest, NextResponse } from "next/server"
// import { getToken } from "next-auth/jwt"
import { connectMongoDB } from "@/db/mongodb"
import Patient from "@/models/patient"
import { getToken } from "next-auth/jwt"
import mongoose from "mongoose"

const secret = process.env.NEXTAUTH_SECRET

// ? ingresar nuevo paciente
export async function POST(req: NextRequest) {

    try {

        const {
            name,
            lastname,
            dateOfBirth,
            diagnosis,
            historyDescription,// motivo de consulta
            reports,
            isActive,
        } = await req.json()
        await connectMongoDB()

        await Patient.create({
            name,
            lastname,
            dateOfBirth,
            diagnosis,
            historyDescription,// motivo de consulta
            reports,
            isActive,
        })

        const patients = await Patient.find()
        return NextResponse.json(patients)

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

// ? get patient list
export async function GET(req: NextRequest) {

    try {

        await connectMongoDB()
        const patients = await Patient.find()
        return NextResponse.json(patients)

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

// ? UPDATE patient 
export async function PATCH(req: NextRequest) {

    try {

        const {
            id,
            name,
            lastname,
            dateOfBirth,
            diagnosis,
            historyDescription,// motivo de consulta
            isActive,
        } = await req.json()
        await connectMongoDB()

        const updatedPatient = await Patient.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    name,
                    lastname,
                    dateOfBirth,
                    diagnosis,
                    historyDescription,
                    isActive
                }
            },
            { new: true })

        return NextResponse.json(updatedPatient)

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