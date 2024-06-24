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
import { Textarea } from "@/components/ui/textarea"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { useContext, useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import { DevTool } from "@hookform/devtools";
import { LoadingContext } from "@/context/LoadingProvider"
import { enqueueSnackbar } from "notistack"
import { styled } from "@mui/material"
import { Switch } from "@/components/ui/switch"
import ColorPicker from 'react-pick-color';
import { ROLES_DICTIONARY, SPECIALITIES_DICTIONARY, SPECIALITIES_VALUES_DICTIONARY, specilities } from "../constants"

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

export function EditUserModal({ userData, refetchUsers }: any) {

    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(userData.isActive);
    const [selectedSpeciality, setSelectedSpeciality] = useState('')
    const { register, handleSubmit, formState: { errors }, setValue, control } = useForm()
    const { setLoading } = useContext(LoadingContext) as any
    const [color, setColor] = useState('#fff');
    const [userRole, setUserRole] = useState('')


    const onSubmit = async (data: any) => {

        try {
            setLoading(true)
            let respUpdateUser = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/user`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: userData._id,
                    name: data.name.trim(),
                    email: data.email.trim(),
                    specilistStatus: data.specilistStatus,
                    speciality: SPECIALITIES_DICTIONARY[data.speciality],
                    role: ROLES_DICTIONARY[data.role],
                    asignColor: data.asignColor,
                })
            })
            if (respUpdateUser.ok) {
                await respUpdateUser.json()
                await refetchUsers()
                setOpen(false)
                setLoading(false)
                enqueueSnackbar('Especialista actualizado exitosamente!', {
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
            enqueueSnackbar('Error actualizando especialista', {
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
        setValue('name', userData?.name)
        setValue('email', userData?.email)
        setValue('specilistStatus', userData?.isActive)

        setValue('speciality', SPECIALITIES_VALUES_DICTIONARY[userData?.speciality])
        setSelectedSpeciality(SPECIALITIES_VALUES_DICTIONARY[userData?.speciality])
        
        setValue('role', userData?.role === 'admin' ? 'Administrador' : 'Especialista')
        setUserRole(userData?.role === 'admin' ? 'Administrador' : 'Especialista')

        setValue('asignColor', userData?.asignColor)
        setColor(userData?.asignColor)
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
                        <DialogTitle>Editar Especialista</DialogTitle>
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
                                    disabled
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
                                    Correo:
                                </Label>
                                <Input
                                    type="text"
                                    defaultValue=""
                                    disabled
                                    {...register("email",
                                        {
                                            required: 'ingrese el correo',
                                            min: { value: 4, message: "The min length is 4 characters" }
                                        })}
                                />
                                {errors.lastname && <p className="text-red-700">{JSON.stringify(errors?.lastname?.message)}</p>}
                            </div>

                            <div className="flex flex-col items-start justify-between gap-2">
                                <Label className="text-right">
                                    Especialidad:
                                </Label>
                                <select
                                    {...register('speciality')}
                                    value={selectedSpeciality}
                                    onChange={(e) => {
                                        setSelectedSpeciality(e.target.value)
                                        setValue('speciality', e.target.value)
                                    }}
                                >
                                    <option key={0}></option>
                                    {specilities.map((specilities: any) => {
                                        if (!specilities) return
                                        return (
                                            <option key={specilities.value}>{specilities.label}</option>
                                        )
                                    })}
                                </select>
                                {errors.speciality && <p className="text-red-700">{JSON.stringify(errors?.speciality?.message)}</p>}
                            </div>


                            <div className="flex flex-col items-start justify-between gap-2">
                                <Label className="text-right">
                                    Role:
                                </Label>
                                <select
                                    {...register('role',
                                        {
                                            required: 'Seleccione una especialidad'
                                        })}
                                    value={userRole}
                                    onChange={(e) => {
                                        setValue('role', e.target.value)
                                        setUserRole(e.target.value)
                                    }}
                                >
                                    <option key={0}></option>
                                    {[
                                        { value: 'admin', label: 'Administrador' },
                                        { value: 'specialist', label: 'Especialista' }
                                    ].map((role: any) => {
                                        if (!role) return
                                        return (
                                            <option key={role.value}>{role.label}</option>
                                        )
                                    })}
                                </select>
                                {errors.role && <p className="text-red-700">{JSON.stringify(errors?.role?.message)}</p>}
                            </div>

                            <Label>Color asignado:</Label>
                            <div className="flex flex-col items-center justify-center w-full space-x-2">
                                <ColorPicker
                                    {...register('asignColor',
                                        {
                                            required: 'Seleccione un color'
                                        })}
                                    color={color}
                                    onChange={color => {
                                        setColor(color.hex)
                                        setValue('asignColor', color.hex)
                                    }}
                                />
                                {errors.asignColor && <p className="text-red-700">{JSON.stringify(errors?.asignColor?.message)}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    className="bg-green-700"
                                    {...register("specilistStatus")}
                                    checked={active}
                                    onCheckedChange={(e) => {
                                        setActive(e)
                                        setValue('specilistStatus', e)
                                    }}
                                />
                                <Label>Desactivar/Activar</Label>
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
