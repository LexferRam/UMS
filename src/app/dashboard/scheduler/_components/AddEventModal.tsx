'use client'

import Combobox from "@/components/ui/Combobox"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Option, Select } from "@material-tailwind/react"
import { Label } from "@radix-ui/react-dropdown-menu"
import { useEffect, useState } from "react"
import Datetime from 'react-datetime';

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
        name: 'Miercoles',
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

export function AddEventModal({ onEventAdded }: any) {

    const [title, setTitle] = useState('')
    const [start, setStart] = useState(new Date())
    const [end, setEnd] = useState(new Date())
    const [users, setUsers] = useState([])
    const [patients, setPatients] = useState([])
    const [selectedUserValue, setSelectedUserValue] = useState('')
    const [selectedPatientValue, setSelectedPatientValue] = useState('')
    const [eventType, setEventType] = useState('')
    const [selectedDays, setSelectedDays] = useState<boolean[]>(
        new Array(7).fill(false)
    )

    const handleOnChange = (position: any) => {
        const updatedCheckedState = selectedDays.map((item, index) =>
            index === position ? !item : item
        );

        setSelectedDays([...updatedCheckedState]);
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();

        const selectedDaysArr = [];
        let valuesDaysOfWeek = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']

        for (let i = 0; i < selectedDays.length; i++) {
            if (selectedDays[i]) {
                selectedDaysArr.push(valuesDaysOfWeek[i]);
            }
        }

        onEventAdded({
            title,
            start,
            end,
            selectedUserValue,
            selectedPatientValue,
            eventType,
            selectedDaysArr
        })
    }


    useEffect(() => {
        const getUsers = async () => {
            let respUsers = await fetch('http://localhost:3000/api/admin')
            let usersResp = await respUsers.json()

            let respPatients = await fetch('http://localhost:3000/api/admin/patient')
            let patientsResp = await respPatients.json()

            let users = await usersResp.map((user: any) => ({ value: user._id, label: user.name }))
            let patients = await patientsResp.map((patient: any) => {
                if(!patient.isActive) return
                return ({ value: patient._id, label: patient.name })
            })

            setUsers(users)
            setPatients(patients)
        }
        getUsers()
    }, [])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="mb-6 bg-blue-100">Agregar Evento</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nuevo Evento</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                            Título
                        </Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                            Fecha inicio
                        </Label>
                        <Datetime value={start} onChange={(date: any) => setStart(new Date(date))} className="col-span-3" />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                            Fecha final
                        </Label>
                        <Datetime value={end} onChange={(date: any) => setEnd(new Date(date))} className="col-span-3" />
                    </div>

                    <div className="flex flex-col gap-4 flex-wrap justify-center">
                        <div>
                            Seleccione dias de recurrencia:
                        </div>
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
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <Label className="text-right">
                            Especialista
                        </Label>
                        <Combobox arrayValues={users} selectedValue={selectedUserValue} setSelectedValue={setSelectedUserValue} />
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <Label className="text-right">
                            Paciente
                        </Label>
                        <select value={selectedPatientValue} onChange={(e) => setSelectedPatientValue(e.target.value)}>
                            {patients.map((patient: any) => {
                                if(!patient) return
                                return(
                                <option key={patient.value}>{patient.label}</option>
                            )})}
                        </select>
                        {/* <Combobox arrayValues={patients} selectedValue={selectedPatientValue} setSelectedValue={setSelectedPatientValue} /> */}
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <Label className="text-right">
                            Tipo de cita:
                        </Label>
                        <Combobox
                            arrayValues={[
                                {
                                    value: "ENTREVISTA",
                                    label: "ENTREVISTA"
                                },
                                {
                                    value: "SESSION",
                                    label: "SESSION"
                                },
                                {
                                    value: "EVALUACION",
                                    label: "EVALUACION"
                                },
                                {
                                    value: "ENTERVISTA_EVALUACION",
                                    label: "ENTERVISTA_EVALUACION"
                                }
                            ]}
                            selectedValue={eventType}
                            setSelectedValue={setEventType}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose>
                        <Button onClick={handleSubmit} type="button">Guardar</Button>
                    </DialogClose>
                </DialogFooter>

            </DialogContent>

        </Dialog>
    )
}
