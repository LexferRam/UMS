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
import { useContext, useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import { DevTool } from "@hookform/devtools";
import { LoadingContext } from "@/context/LoadingProvider"
import { enqueueSnackbar } from "notistack"
import SelectedListInput from "./SelectedListInput"
import { styled } from "@mui/material"
import AccordionTransition from "./AccordionPatientStatus"

interface IAddPatientModal {
    refetch?: any,
    patient?: any
}

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

export function EditPatientModal({ refetch, patient }: IAddPatientModal) {

    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(patient.isActive);
    const { register, handleSubmit, formState: { errors }, setValue, control } = useForm()
    const { setLoading } = useContext(LoadingContext) as any

    const specialistsAssigned = patient?.specialistAssigned

    const onSubmit = async (data: any) => {

        try {
            setLoading(true)
            let respPatients = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/patient`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: patient._id,
                    name: data.name.trim(),
                    lastname: data.lastname.trim(),
                    dateOfBirth: data.dateOfBirth,
                    diagnosis: data.diagnosis,
                    historyDescription: data.historyDescription,
                    isActive: data.isActive,
                    readySpecialistList: data.readySpecialistList.map((especialista: any) => especialista._id),
                    desactivatedForSpecialistList: data.desactivatedForSpecialistList.map((especialista: any) => especialista._id)
                })
            })
            if (respPatients.ok) {
                await respPatients.json()
                await refetch()
                setOpen(false)
                setLoading(false)
                enqueueSnackbar('Paciente actualizado exitosamente!', {
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
            console.log(error)
            setLoading(false)
            enqueueSnackbar('Error actualizando paciente', {
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

    useEffect(() => {
        setValue('name', patient.name)
        setValue('lastname', patient.lastname)
        setValue('dateOfBirth', patient.dateOfBirth)
        setValue('diagnosis', patient.diagnosis)
        setValue('historyDescription', patient.historyDescription)
        setValue('isActive', patient.isActive)
        setValue('readySpecialistList', patient.readySpecialistList)
        setValue('desactivatedForSpecialistList', patient.desactivatedForSpecialistList)
    }, [])

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

            <DialogContent className="max-w-[500px] sm:max-w-[425px] overflow-y-scroll">
                <div className='max-h-[500px] sm:max-h-[550px]'>
                    <DialogHeader>
                        <DialogTitle>Editar Paciente</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="grid gap-4 py-4">
                            <div className="flex flex-row gap-2">
                                <div className="flex flex-col items-start">
                                    <Label className="text-right">
                                        Nombre:
                                    </Label>
                                    <Input
                                        type="text"
                                        defaultValue=""
                                        autoFocus={false}
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
                                    className="h-[180px]"
                                    {...register("historyDescription",
                                        {
                                            required: 'ingrese el motivo de consulta',
                                            min: { value: 10, message: "The min length is 10 characters" }
                                        })}
                                />
                                {errors.historyDescription && <p className="text-red-700">{JSON.stringify(errors?.historyDescription?.message)}</p>}
                            </div>

                            <div className="flex items-center">
                                <AccordionTransition>
                                    <SelectedListInput
                                        label='Dado de alta por:'
                                        register={register}
                                        keyRHF='readySpecialistList'
                                        specialistsAssigned={specialistsAssigned}
                                        setValue={setValue}
                                        readySpecialist={patient?.readySpecialistList}
                                    />
                                    <SelectedListInput
                                        label='Desactivado para:'
                                        register={register}
                                        keyRHF='desactivatedForSpecialistList'
                                        specialistsAssigned={specialistsAssigned}
                                        setValue={setValue}
                                        readySpecialist={patient?.desactivatedForSpecialistList}
                                    />
                                </AccordionTransition>
                            </div>

                        </div>

                        <DialogFooter>
                            <button
                                className=" w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ffc260] hover:bg-[#f8b84e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f8fafc] mb-2"
                                type="submit"
                            >
                                Guardar
                            </button>
                        </DialogFooter>
                    </form>
                    <DevTool control={control} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
