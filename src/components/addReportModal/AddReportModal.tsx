'use client'

import { FC, useContext, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "../ui/textarea"
import { PlusIcon } from "@heroicons/react/24/outline"
import { useForm } from "react-hook-form"
import { Alert } from "@mui/material"
import { LoadingContext } from "@/context/LoadingProvider"
import { useSnackbar } from "notistack"
import AddCircleIcon from '@mui/icons-material/AddCircle';

export const AddReportModal: FC<{ 
    eventId: string, 
    patient: any, 
    dateOfMissingReport?: any,
    refecthFns?: any
}> = ({ eventId, patient, dateOfMissingReport, refecthFns }) => {

    const [open, setOpen] = useState(false);
    const [isAddingReport, setIsAddingReport] = useState(false)
    const { setLoading } = useContext(LoadingContext) as any
    const { enqueueSnackbar } = useSnackbar()
    const { register, handleSubmit, formState: { errors }, reset} = useForm()

    let datePortion = dateOfMissingReport.split(',')[0].split('/')
    let formatDate = new Date(datePortion[2], datePortion[1]-1, datePortion[0])
    
    const handleSubmitReport = async (data: any) => {
        try {
            setIsAddingReport(true)
            setLoading(true)

            let missingReportObject = {
                description: data.description,
                associatedEvent: eventId,
                patient: patient._id,
                createdAt: formatDate,
                isForEventCancel: false
            }

            let reportObject = {
                description: data.description,
                associatedEvent: eventId,
                patient: patient._id,
                isForEventCancel: false
            }

            let reportToDB = dateOfMissingReport ? missingReportObject : reportObject

            const respAddReport = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/reports`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reportToDB)
            })
            if (respAddReport.ok) {
                setOpen(false)
                await refecthFns.refetchReports(),
                await refecthFns.refetchUserEvent(),
                reset();
                setIsAddingReport(false)
                setLoading(false)
                enqueueSnackbar('Reporte agregado exitosamente!', {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    autoHideDuration: 5000,
                    key: 'error-delete-event'
                })
                return
            }
        } catch (error) {
            console.error(error)
            setLoading(false)
            enqueueSnackbar('Error agregando reporte', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
                autoHideDuration: 5000,
                key: 'error-delete-event'
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
                <div
                    onClick={() => setOpen(true)}
                    className="flex gap-2 items-center cursor-pointer"
                >
                    <AddCircleIcon className="h-6 w-6 text-green-500 cursor-pointer font-extrabold" /> Agregar Reporte
                </div>

            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Nuevo Reporte</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleSubmitReport)}>
                    <div className="grid gap-2 pb-4">
                        <div className="flex flex-col justify-start items-center gap-4">
                            <Alert severity="warning" className='w-[100%]'>
                                En caso de cancelación de la cita, no enviar reporte. El administrador lo agregará.
                            </Alert>
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
                            disabled={isAddingReport}
                        >
                            {isAddingReport ? "Guardando..." : "Guardar" }
                        </button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    )
}
