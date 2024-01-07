'use client'

import { FC, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "../ui/textarea"
import { PlusIcon } from "@heroicons/react/24/outline"

export const AddReportModal: FC<{ 
    eventId: string, 
    patient: any, 
    dateOfMissingReport?: any 
}> = ({ eventId, patient, dateOfMissingReport }) => {

    const [description, setDescription] = useState('')

    console.log(eventId)

    const handleClick = async (event: any) => {
        event.preventDefault();

        let missingReportObject = {
            description,
            associatedEvent: eventId,
            patient: patient._id,
            createdAt: new Date(dateOfMissingReport)
        }

        let reportObject = {
            description,
            associatedEvent: eventId,
            patient: patient._id
        }

        let reportToDB = dateOfMissingReport ? missingReportObject : reportObject
        console.log(reportToDB)

        const respAddReport = await fetch('http://localhost:3000/api/admin/reports', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reportToDB)
        })
        if (respAddReport.ok) {
            return
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex gap-2 items-center cursor-pointer">
                    <PlusIcon className="h-6 w-6 text-red-500 cursor-pointer font-extrabold" /> Agregar Reporte
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Nuevo Reporte</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex flex-col justify-start items-center gap-4">
                        <Textarea
                            placeholder="Agregue la descripción de su reporte"
                            id="title"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="h-[450px]" required
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleClick} type="button">Guardar</Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}
