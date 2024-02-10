'use client'

import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { addOneYear } from "@/util/dates"
import { Label } from "@radix-ui/react-dropdown-menu"
import { useEffect, useState } from "react"
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
        label: "SESION"
    },
    {
        value: "EVALUACION",
        label: "EVALUACION"
    },
    {
        value: "ENTERVISTA_EVALUACION",
        label: "ENTERVISTA_EVALUACION"
    },
    {
        value: "RECUPERACION",
        label: "RECUPERACION"
    },
]

const EditEventModal = ({ eventDetails, refetchEvents, setOpen, setEditEvent }: any) => {
    let valuesDaysOfWeek = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']
    let initialSelectedDays = valuesDaysOfWeek.map((item: any) => {
        return eventDetails.extendedProps.byweekday.includes(item) ? true : false
    })
    const [active, setActive] = useState(false)
    const [selectedDays, setSelectedDays] = useState<boolean[]>(initialSelectedDays)
    const [users, setUsers] = useState([])
    const [patients, setPatients] = useState([])
    const [selectedUser, setSelectedUser] = useState('')
    const [patient, setPatient] = useState('')
    const [eventTp, setEventTp] = useState('')

    let formatDateToDB = (date: any) => {
        return new Date(date).toISOString()
    }

    const { register, handleSubmit, formState: { errors }, setValue } = useForm()

    const onSubmit = async (data: any) => {

        const foundPatient: any = patients.filter((item: any) => item?.label.trim() === data.selectedPatient)
        const foundUser: any = users.filter((item: any) => item?.label.trim() === data.selectedUserValue)
        const foundEventType: any = eventTypeArray.filter((item: any) => item?.label === data.eventType)

        const selectedDaysArr: any = [];

        for (let i = 0; i < selectedDays.length; i++) {
            if (selectedDays[i]) {
                selectedDaysArr.push(valuesDaysOfWeek[i]);
            }
        }

        let updatedEvent = {
            title: data.title,
            start: formatDateToDB(data.eventDate + 'T' + data.timeStart),
            end: selectedDaysArr.length > 0 ?
                formatDateToDB(addOneYear(data.eventDate) + 'T' + data.timeEnd) :
                // TODO: la funcion addOneYear debe agregar un dia mas
                formatDateToDB(data.eventDate + 'T' + data.timeEnd),
            _asignTo: foundUser[0].value,
            patient: foundPatient[0].value,
            selectedDaysArr: selectedDaysArr,
            eventType: foundEventType[0].value
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/events/${eventDetails.extendedProps._id}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...updatedEvent,
                start: updatedEvent.start,
                end: updatedEvent.end
            })
        })

        if (res.ok) {
            setOpen(false)
            await refetchEvents()
            setEditEvent(false)
        }


    }

    const handleOnChange = (position: any) => {
        const updatedCheckedState = selectedDays.map((item, index) =>
            index === position ? !item : item
        );
        setSelectedDays([...updatedCheckedState]);
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

    useEffect(() => {

        if (eventDetails.extendedProps.byweekday.length > 0) setActive(true)

        setValue('title', eventDetails?.title)

        setValue('selectedUserValue', eventDetails?.extendedProps?._asignTo.name)
        setSelectedUser(eventDetails?.extendedProps?._asignTo.name)

        setValue('selectedPatient', eventDetails?.extendedProps?.patient?.name + eventDetails?.extendedProps?.patient?.lastname)
        setPatient(eventDetails?.extendedProps?.patient?.name + eventDetails?.extendedProps?.patient?.lastname)

        setValue('eventType', eventDetails?.extendedProps?.eventType)
        setEventTp(eventDetails?.extendedProps?.eventType)

        setValue('eventDate', eventDetails?.start?.toISOString()?.split('T')[0])
        console.log(eventDetails?.start?.toISOString()?.split('T')[0])

        setValue(
            'timeStart',
            eventDetails?.start?.toUTCString()?.split(' ')[4]
        )
        setValue(
            'timeEnd',
            eventDetails?.end?.toUTCString()?.split(' ')[4]
        )

    }, [])


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">

                <div className="flex gap-4">
                    {/* titulo */}
                    <div className="flex flex-col gap-2 flex-wrap justify-center items-start">
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
                            onChange={((e) => {
                                setValue('title', e.target.value)
                            })}
                        />
                        {errors.title && <p className="text-red-700">{JSON.stringify(errors?.title?.message)}</p>}
                    </div>

                    {/* fecha de inicio */}
                    <div className="flex flex-col gap-2 flex-wrap justify-center items-start">
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
                    {/* hora inicio */}
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

                    {/* hora final */}
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

                {/* Dias de recurrecia */}
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
                    <div className="flex flex-col items-start justify-between gap-2">
                        <Label className="text-right">
                            Especialista:
                        </Label>
                        <select
                            {...register('selectedUserValue',
                                {
                                    required: 'Seleccione un terapeuta'
                                })}
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            disabled
                            className="cursor-not-allowed"
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
                            value={patient}
                            onChange={(e) => setPatient(e.target.value)}
                            disabled
                            className="cursor-not-allowed"
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

                {/* tipo de cita */}
                <div className="flex flex-col items-start justify-between gap-2">
                    <Label className="text-right">
                        Tipo de cita:
                    </Label>
                    <select
                        {...register('eventType',
                            {
                                required: 'Seleccione el tipo de evento'
                            })}
                        value={eventTp}
                        onChange={(e) => setEventTp(e.target.value)}
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

            </div>

            <DialogFooter>
                <button
                    className=" w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ffc260] hover:bg-[#f8b84e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f8fafc] cursor-not-allowed"
                    type="submit"
                    disabled
                >
                    Guardar
                </button>
            </DialogFooter>
        </form>
    )
}

export default EditEventModal