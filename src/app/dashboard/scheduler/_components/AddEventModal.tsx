'use client'

import { useEffect, useState } from "react"
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
import { Switch } from "@/components/ui/switch"
import { addOneDay, addOneYear } from "@/util/dates"
import { Label } from "@radix-ui/react-dropdown-menu"
import { useForm } from "react-hook-form"

const daysOfWeek = [
    {
        id: 1,
        name: 'Lunes',
        value: 'mo'
    },
    {
        id: 2,
        name: 'Martes',
        value: 'tu'
    },
    {
        id: 3,
        name: 'Miércoles',
        value: 'we'
    },
    {
        id: 4,
        name: 'Jueves',
        value: 'th'
    },
    {
        id: 5,
        name: 'Viernes',
        value: 'fr'
    },
    {
        id: 6,
        name: 'Sábado',
        value: 'sa'
    },
    {
        id: 7,
        name: 'Domingo',
        value: 'su'
    }
]

const eventTypeArray = [
    {
        value: "ENTREVISTA",
        label: "ENTREVISTA"
    },
    {
        value: "SESION",
        label: "SESIÓN"
    },
    {
        value: "EVALUACION",
        label: "EVALUACIÓN"
    },
    {
        value: "ENTERVISTA_EVALUACION",
        label: "ENTERVISTA_EVALUACIÓN"
    },
    {
        value: "RECUPERACION",
        label: "RECUPERACIÓN"
    },
    {
        value: "NEUROPEDIATRIA",
        label: "NEUROPEDIATRÍA"
    },
    {
        value: "PEDIATRIA",
        label: "PEDIATRÍA"
    }
]

export function AddEventModal({ onEventAdded, open, setOpen }: any) {

    const [users, setUsers] = useState([])
    const [patients, setPatients] = useState([])
    const [active, setActive] = useState(false)
    const [isAddingEvent, setIsAddingEvent] = useState(false)

    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const [selectedDays, setSelectedDays] = useState<boolean[]>(
        new Array(7).fill(false)
    )

    const handleOnChange = (position: any) => {
        const updatedCheckedState = selectedDays.map((item, index) =>
            index === position ? !item : item
        );

        setSelectedDays([...updatedCheckedState]);
    }

    const onSubmit = async (data: any) => {
        setIsAddingEvent(true)

        const foundPatient: any = patients.filter((item: any) => item?.label.trim() === data.selectedPatient)

        const foundUser: any = users.filter((item: any) => item?.label.trim() === data.selectedUserValue)

        const foundEventType: any = eventTypeArray.filter((item: any) => item?.label === data.eventType)

        const selectedDaysArr = [];
        let valuesDaysOfWeek = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']

        for (let i = 0; i < selectedDays.length; i++) {
            if (selectedDays[i]) {
                selectedDaysArr.push(valuesDaysOfWeek[i]);
            }
        }

        onEventAdded({
            title: data.title,
            start: data.eventDate + 'T' + data.timeStart + ':' + '00',
            end: !selectedDaysArr.length ? 
                    addOneDay(data.eventDate) + 'T' + data.timeEnd + ':' + '00' : 
                    // TODO: la funcion addOneYear debe agregar un dia mas
                    addOneYear(data.eventDate) + 'T' + data.timeEnd + ':' + '00',
            selectedUserValue: foundUser[0].value,
            selectedPatientValue: foundPatient[0].value,
            eventType: foundEventType[0].value,
            selectedDaysArr,
            setOpen,
            reset,
            setActive,
            setSelectedDays,
            setIsAddingEvent
        })
    }

    useEffect(() => {
        const getUsers = async () => {
            let respUsers = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin`)
            let usersResp = await respUsers.json()

            let respPatients = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/patient`)
            let patientsResp = await respPatients.json()

            let users = await usersResp.map((user: any) => ({ value: user._id, label: user.name }))
            let patients = await patientsResp.map((patient: any) => {
                if (!patient.isActive) return
                return ({ value: patient._id, label: patient.name + patient.lastname })
            })

            setUsers(users)
            setPatients(patients)
        }
        getUsers()
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={() => setOpen(true)} variant="outline"
                    className="mb-6 bg-blue-100"
                >
                    Agregar Evento
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nuevo Evento</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">

                        <div className="flex gap-4">
                            <div className="w-full flex flex-col gap-2 flex-wrap justify-center items-start">
                                <Label className="text-right">
                                    Título:
                                </Label>
                                <Input
                                    type="text"
                                    defaultValue=""
                                    {...register("title",
                                        {
                                            required: 'Ingrese el título',
                                            min: { value: 4, message: "La longitud minima es de 4 caracteres" }
                                        })}
                                />
                                {errors.title && <p className="text-red-700">{JSON.stringify(errors?.title?.message)}</p>}
                            </div>

                            <div className=" w-full flex flex-col gap-2 flex-wrap justify-center items-start">
                                <Label className="text-right">
                                    Fecha Inicio:
                                </Label>
                                <input
                                    type="date"
                                    {...register("eventDate",
                                        {
                                            required: 'Ingrese la fecha del evento',
                                            min: { value: 4, message: "The min length is 4 characters" }
                                        })}
                                    className="w-full"
                                />
                                {errors.eventDate && <p className="text-red-700">{JSON.stringify(errors?.eventDate?.message)}</p>}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-full flex flex-col items-start gap-2">
                                <Label className="text-right">
                                    Hora inicio:
                                </Label>
                                <input
                                    type="time"
                                    {...register("timeStart",
                                        {
                                            required: 'Ingrese la hora de inicio'
                                        })}
                                    className="w-full"
                                />
                                {errors.timeStart && <p className="text-red-700">{JSON.stringify(errors?.timeStart?.message)}</p>}
                            </div>

                            <div className="w-full flex flex-col items-start gap-2">
                                <Label className="text-right">
                                    Hora final:
                                </Label>
                                <input
                                    type="time"
                                    {...register("timeEnd",
                                        {
                                            required: 'Ingrese la hora de culminación'
                                        })}
                                    className="w-full"
                                />
                                {errors.timeEnd && <p className="text-red-700">{JSON.stringify(errors?.timeEnd?.message)}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 flex-wrap justify-center">
                            <div className="flex gap-4">
                                <div>
                                    Seleccione días de recurrencia:
                                </div>
                                <div>
                                    <Switch
                                        className="bg-green-700"
                                        checked={active}
                                        onCheckedChange={(e) => {
                                            setActive(e)
                                        }}
                                    />
                                </div>
                            </div>
                            {active && (
                                <div className="flex gap-4 flex-wrap justify-center">
                                    {daysOfWeek.map((day, i) => (
                                        <div className="flex gap-1 items-center" key={day.id}>
                                            <input
                                                type="checkbox"
                                                id={day.name}
                                                name={day.name}
                                                value={day.name}
                                                checked={selectedDays[i]}
                                                onChange={() => handleOnChange(i)}
                                            />
                                            <label
                                                htmlFor={day.name}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {day.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            {/* Terapeuta */}
                            <div className="w-full flex flex-col items-start justify-between gap-2">
                                <Label className="text-right">
                                    Especialista:
                                </Label>
                                <select
                                    {...register('selectedUserValue',
                                        {
                                            required: 'Seleccione un terapeuta'
                                        })}
                                >
                                    <option key={0}></option>
                                    {users.map((user: any) => {
                                        if (!user) return
                                        return (
                                            <option key={user.value}>{user.label}</option>
                                        )
                                    })}
                                </select>
                                {errors.selectedUserValue && <p className="text-red-700">{JSON.stringify(errors?.selectedUserValue?.message)}</p>}
                            </div>

                            {/* Paciente */}
                            <div className="flex flex-col items-start justify-between gap-2">
                                <Label className="text-right">
                                    Paciente:
                                </Label>
                                <select
                                    {...register('selectedPatient',
                                        {
                                            required: 'Seleccione un paciente'
                                        })}
                                >
                                    <option key={0}></option>
                                    {patients.map((patient: any) => {
                                        if (!patient) return
                                        return (
                                            <option key={patient.value}>{patient.label}</option>
                                        )
                                    })}
                                </select>
                                {errors.selectedPatient && <p className="text-red-700">{JSON.stringify(errors?.selectedPatient?.message)}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col items-start justify-between gap-2">
                            <Label className="text-right">
                                Tipo de cita:
                            </Label>
                            <select
                                {...register('eventType',
                                    {
                                        required: 'Seleccione el tipo de evento'
                                    })}
                            >
                                <option key={0}></option>
                                {eventTypeArray.map((eventType: any) => {
                                    return (
                                        <option key={eventType.value}>{eventType.label}</option>
                                    )
                                })}
                            </select>
                            {errors.eventType && <p className="text-red-700">{JSON.stringify(errors?.eventType?.message)}</p>}
                        </div>
{/* 
                        <div className="flex flex-col gap-2 flex-wrap justify-center items-start">
                            <Label className="text-right">
                                Nota:
                            </Label>
                            <Input
                                disabled
                                type="text"
                                defaultValue=""
                                {...register("note")}
                            />
                        </div> */}
                    </div>

                    <DialogFooter>
                        <button
                            className=" w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ffc260] hover:bg-[#f8b84e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f8fafc]"
                            type="submit"
                            disabled={isAddingEvent}
                        >
                           {isAddingEvent ? "Agregando Evento...": "Guardar"} 
                        </button>
                    </DialogFooter>
                </form>

            </DialogContent>

        </Dialog>
    )
}
