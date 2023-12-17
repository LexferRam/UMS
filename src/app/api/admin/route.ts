
import { connectMongoDB } from "@/db/mongodb"
import Event from "@/models/event"
import User from "@/models/user"
import { NextApiRequest } from "next"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const secret = process.env.NEXTAUTH_SECRET

export async function GET(req: NextApiRequest) {

    try {

        const token = await getToken({ req, secret })

        if(token?.email !== 'lexferramirez@gmail.com') return NextResponse.json([])

        await connectMongoDB()
        const users = await User.find()
        return NextResponse.json(users)

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

export async function POST(req: NextRequest) {

    try {

        const token = await getToken({ req, secret })
        if(token?.email !== 'lexferramirez@gmail.com') return NextResponse.json([])

        try {
            const { _creator, _asignTo, title, start, end, patient } = await req.json()
            await connectMongoDB()
             
            const event = await Event.create({_creator, _asignTo, title, start, end, patient})

                        // ? Buscar user por campo _asignTo
                        let userFound = await User.findById({_id: _asignTo})
            
                        // ? hacer push en su propiedad "events"
                        await userFound.events.push(event)

                        // ? guardar informacion del nueva del user
                        await userFound.save()

                        // ? hacer push en su propiedad "patients"
                        await userFound.asignedPatients.push(patient)
            
                        // ? guardar informacion del nueva del user
                        await userFound.save()

                        // // ? Updated user with events
                        // let updatedUser = await User.findById({_id:_asignTo }).populate("events")

            return NextResponse.json(event, {status: 201})

        } catch (error) {
            console.log(error)
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