import { NextRequest, NextResponse } from "next/server"
// import { getToken } from "next-auth/jwt"
import { connectMongoDB } from "@/db/mongodb"
import Patient from "@/models/patient"
import { getToken } from "next-auth/jwt"

const secret = process.env.NEXTAUTH_SECRET

// ? ingresar nuevo paciente
export async function POST(req: NextRequest) {

    try {

        // const token = await getToken({ req, secret })
        // if (token?.email !== 'lexferramirez@gmail.com') return NextResponse.json([])

        const {
            email,
            name,
            lastname,
            isActive,
            historyDescription,
            reports
        } = await req.json()
        await connectMongoDB()

        await Patient.create({ email, name, lastname, isActive, historyDescription, reports })

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

        // const token = await getToken({ req, secret })

        // if(token?.email !== 'lexferramirez@gmail.com') return NextResponse.json([])

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