'use client'

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
import { Textarea } from "@/components/ui/textarea"
import { UserPlusIcon } from "@heroicons/react/24/outline"
import { Label } from "@radix-ui/react-dropdown-menu"
import { useState } from "react"
import Datetime from 'react-datetime';

export function AddPatientModal({refetch}: any) {

    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [historyDescription, setHistoryDescription] = useState('')

    const handleSubmit = async () => {

        let respPatients = await fetch('http://localhost:3000/api/admin/patient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                lastname,
                email,
                historyDescription,
                isActive: true,
                reports: []
            })
        })
        let patientsResp = await respPatients.json()
        refetch()
        console.log(patientsResp)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Ingresar paciente
                    <UserPlusIcon className="ml-2 h-5 w-5 text-green-500 cursor-pointer" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nuevo Paciente</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex flex-col items-start">
                        <Label className="text-right">
                            Nombre:
                        </Label>
                        <Input id="title" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="flex flex-col items-start">
                        <Label className="text-right">
                            Apellido:
                        </Label>
                        <Input value={lastname} onChange={(e) => setLastname(e.target.value)} />
                    </div>

                    <div className="flex flex-col items-start">
                        <Label className="text-right">
                            Fecha de nacimiento:
                        </Label>
                        <Datetime
                        //  value={start} onChange={(date: any) => setStart(new Date(date))} 
                         className="w-full" 
                         />
                    </div>

                    <div className="flex flex-col items-start">
                        <Label className="text-right">
                            Diagnóstico:
                        </Label>
                        <Input value={lastname} onChange={(e) => setLastname(e.target.value)} />
                    </div>

                    <div className="flex flex-col items-start">
                        <Label className="text-right">
                            Motivo de consulta:
                        </Label>
                        <Textarea value={historyDescription} className="" onChange={(e) => setHistoryDescription(e.target.value)} />
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
