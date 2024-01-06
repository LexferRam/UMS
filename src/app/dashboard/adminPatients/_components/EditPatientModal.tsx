'use client'

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { Label } from "@radix-ui/react-dropdown-menu"
import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form'

interface IAddPatientModal {
    refetch?: any,
    patient?: any
}

export function EditPatientModal({ refetch, patient }: IAddPatientModal) {

    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(patient.isActive);
    const { register, handleSubmit, formState: { errors }, reset, setValue} = useForm()

    const onSubmit = async (data: any) => {


        let respPatients = await fetch('http://localhost:3000/api/admin/patient', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: patient._id,
                name: data.name,
                lastname: data.lastname,
                dateOfBirth: data.dateOfBirth,
                diagnosis: data.diagnosis,
                historyDescription: data.historyDescription,
                isActive: data.isActive
            })
        })
        await respPatients.json()
        await refetch()
        // reset();
        setOpen(false)
    }

    useEffect(()=> {

        setValue('name', patient.name)
        setValue('lastname', patient.lastname)
        setValue('dateOfBirth', patient.dateOfBirth)
        setValue('diagnosis', patient.diagnosis)
        setValue('historyDescription', patient.historyDescription)
        setValue('isActive', patient.isActive)
    },[])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div
                    onClick={() => setOpen(true)}
                    className="flex gap-1 cursor-pointer items-center"
                >
                    <PencilSquareIcon
                        className="h-6 w-6 text-green-500"
                    />
                    <span
                        className='text-sm font-semibold text-gray-600'
                    >
                        Editar
                    </span>
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Paciente</DialogTitle>
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

                        <div className="flex items-center space-x-2">
                            <Switch 
                                className="bg-green-700" 
                                {...register("isActive")}
                                checked={active}
                                onCheckedChange={(e) => {
                                    setActive(e)
                                    setValue('isActive', e)
                                }}
                            />
                            <Label>Activar/Dar de baja</Label>
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
