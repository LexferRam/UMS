import { connectMongoDB } from "@/db/mongodb"
import User from "@/models/user"
import { NextApiRequest } from "next"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const secret = process.env.NEXTAUTH_SECRET

export async function POST(request: NextRequest) {
    const { name, email, lastname } = await request.json()
    await connectMongoDB()
    await User.create({ name, email, lastname, isActive: false, role: 'specialist' })
    return NextResponse.json({ message: "User Register" }, { status: 201 })
}
