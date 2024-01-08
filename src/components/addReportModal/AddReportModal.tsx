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
import { useForm } from "react-hook-form"

export const AddReportModal: FC<{ 
    eventId: string, 
    patient: any, 
    dateOfMissingReport?: any,
    refecthFns?: any
}> = ({ eventId, patient, dateOfMissingReport, refecthFns }) => {

    const [open, setOpen] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset} = useForm()

    const handleClick = async (data: any) => {

        let missingReportObject = {
            description: data.description,
            associatedEvent: eventId,
            patient: patient._id,
            createdAt: new Date(dateOfMissingReport)
        }

        let reportObject = {
            description: data.description,
            associatedEvent: eventId,
            patient: patient._id
        }

        let reportToDB = dateOfMissingReport ? missingReportObject : reportObject

        const respAddReport = await fetch(`${process.env.NEXTAUTH_BASE_API}/api/admin/reports`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reportToDB)
        })
        if (respAddReport.ok) {
            setOpen(false)
            await refecthFns.refetchUserInfo(),
            await refecthFns.refetchReports(),
            await refecthFns.refetchUserEvent(),
            reset();
            return
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div
                    onClick={() => setOpen(true)}
                    className="flex gap-2 items-center cursor-pointer"
                >
                    <PlusIcon className="h-6 w-6 text-red-500 cursor-pointer font-extrabold" /> Agregar Reporte
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Nuevo Reporte</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleClick)}>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col justify-start items-center gap-4">
                            <Textarea
                                placeholder="Agregue la descripción de su reporte"
                                defaultValue=""
                                {...register("description",
                                    {
                                        required: 'Ingrese la descripción del reporte',
                                        min: { value: 4, message: "Agregue una descripción mas extensa" }
                                    })}
                                className="h-[450px]"
                            />
                            {errors.description && <p className="text-red-700">{JSON.stringify(errors?.description?.message)}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <button
                            className=" w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ffc260] hover:bg-[#f8b84e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f8fafc]"
                            type="submit"
                        >
                            Guardar
                        </button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    )
}
