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
