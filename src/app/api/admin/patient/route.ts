export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server"
import { connectMongoDB } from "@/db/mongodb"
import Patient from "@/models/patient"
import User from "@/models/user"

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
        
        const patients = await Patient.find().populate({
            path: "readySpecialistList",
            model: User,
        }).populate({
            path: "desactivatedForSpecialistList",
            model: User,
        })

        //  // ? update all patients isActive to false
        //  patients.map(async(item: any) => {
        //     await Patient.findByIdAndUpdate({_id: item._id},{$set: {"isActive": false}})
        // })

        const specialistList = await User.find()
      

        let patientListWithSpecialistList = patients.map((patient: any) => {
            let specialistAssigned = []
            for (let i = 0; i < specialistList.length; i++) {
                const specialist = specialistList[i]
                if (specialist.asignedPatients.map((patient: any) => patient._id.toString()).includes(patient._id.toString())) {
                    specialistAssigned.push(specialist)
                }
            }
            return {
                ...patient._doc,
                specialistAssigned
            }
        })

        return NextResponse.json(patientListWithSpecialistList)

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
            readySpecialistList,
            desactivatedForSpecialistList
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
                    isActive,
                    readySpecialistList,
                    desactivatedForSpecialistList
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