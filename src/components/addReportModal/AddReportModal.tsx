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
import { useRouter } from "next/navigation"
import { PlusIcon } from "@heroicons/react/24/outline"

export const AddReportModal: FC<{ eventId: string, patient: any }> = ({ eventId, patient }) => {

    const router = useRouter()

    const [description, setDescription] = useState('')

    const handleClick = async (event: any) => {
        event.preventDefault();

        const respAddReport = await fetch('http://localhost:3000/api/admin/reports', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                description,
                associatedEvent: eventId,
                patient: patient._id
            })
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
                        <Textarea placeholder="Agregue la descripción de su reporte" id="title" value={description} onChange={(e) => setDescription(e.target.value)} className="h-[450px]" required />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleClick} type="button">Guardar</Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}
