'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UserPlusIcon } from "@heroicons/react/24/outline"
import { Label } from "@radix-ui/react-dropdown-menu"
import { useState } from "react"
import { useForm } from 'react-hook-form'

interface IAddPatientModal {
    refetch?: any
}

export function AddPatientModal({ refetch }: IAddPatientModal) {

    const [open, setOpen] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const onSubmit = async (data: any) => {

        let respPatients = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/patient`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                lastname: data.lastname,
                dateOfBirth: data.dateOfBirth,
                diagnosis: data.diagnosis,
                historyDescription: data.historyDescription,
                isActive: true,
                reports: []
            })
        })
        await respPatients.json()
        await refetch()
        reset();
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(true)}>
                    Ingresar paciente
                    <UserPlusIcon className="ml-2 h-5 w-5 text-green-500 cursor-pointer" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nuevo Paciente</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col items-start">
                            <Label className="text-right">
                                Nombre:
                            </Label>
                            <Input
                                type="text"
                                defaultValue=""
                                {...register("name",
                                    {
                                        required: 'Ingrese el nombre',
                                        min: { value: 4, message: "The min length is 4 characters" }
                                    })}
                            />
                            {errors.name && <p className="text-red-700">{JSON.stringify(errors?.name?.message)}</p>}
                        </div>

                        <div className="flex flex-col items-start">
                            <Label className="text-right">
                                Apellido:
                            </Label>
                            <Input
                                type="text"
                                defaultValue=""
                                {...register("lastname",
                                    {
                                        required: 'ingrese el apellido',
                                        min: { value: 4, message: "The min length is 4 characters" }
                                    })}
                            />
                            {errors.lastname && <p className="text-red-700">{JSON.stringify(errors?.lastname?.message)}</p>}
                        </div>

                        <div className="flex flex-col items-start">
                            <Label className="text-right">
                                Fecha de nacimiento:
                            </Label>
                            <input
                                type="date"
                                {...register("dateOfBirth",
                                    {
                                        required: 'Ingrese la fecha de nacimiento',
                                        min: { value: 4, message: "The min length is 4 characters" }
                                    })}
                                className="w-full"
                            />
                            {errors.dateOfBirth && <p className="text-red-700">{JSON.stringify(errors?.dateOfBirth?.message)}</p>}
                        </div>

                        <div className="flex flex-col items-start">
                            <Label className="text-right">
                                Diagnóstico:
                            </Label>
                            <Input
                                type="text"
                                defaultValue=""
                                {...register("diagnosis",
                                    {
                                        required: 'Ingrese el diagnostico',
                                        min: { value: 4, message: "The min length is 4 characters" }
                                    })}
                            />
                            {errors.diagnosis && <p className="text-red-700">{JSON.stringify(errors?.diagnosis?.message)}</p>}

                        </div>

                        <div className="flex flex-col items-start">
                            <Label className="text-right">
                                Motivo de consulta:
                            </Label>
                            <Textarea
                                defaultValue=""
                                {...register("historyDescription",
                                    {
                                        required: 'ingrese el motivo de consulta',
                                        min: { value: 4, message: "The min length is 4 characters" }
                                    })}
                            />
                            {errors.historyDescription && <p className="text-red-700">{JSON.stringify(errors?.historyDescription?.message)}</p>}
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
