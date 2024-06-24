import { connectMongoDB } from "@/db/mongodb"
import User from "@/models/user"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    const { name, email, lastname } = await request.json()
    await connectMongoDB()
    await User
        .create({ 
            name, 
            email, 
            lastname, 
            isActive: true, 
            role: 'specialist', 
            speciality: ''
        })
    return NextResponse.json({ message: "User Register" }, { status: 201 })
}

// ? UPDATE user 
export async function PATCH(req: NextRequest) {

    try {

        const {
            id,
            name,
            email,
            specilistStatus,
            speciality,
            role,
            asignColor,
        } = await req.json()

        await connectMongoDB()

        const updatedUser = await User.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    name,
                    email,
                    specilistStatus,
                    speciality,
                    role,
                    asignColor,
                }
            },
            { new: true })

        return NextResponse.json(updatedUser)

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