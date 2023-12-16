'use client'

import Combobox from "@/components/ui/Combobox"
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
import { Label } from "@radix-ui/react-dropdown-menu"
import { useEffect, useState } from "react"
import Datetime from 'react-datetime';

export function AddEventModal({ onEventAdded }: any) {

    const [title, setTitle] = useState('')
    const [start, setStart] = useState(new Date())
    const [end, setEnd] = useState(new Date())
    const [selectedValue, setSelectedValue] = useState('')

    const handleSubmit = (event: any) => {
        event.preventDefault();

        onEventAdded({
            title,
            start,
            end,
            selectedValue
        })
    }

    const [users, setUsers] = useState([])
    
    useEffect(() => {
        const getUsers = async () => {
            let respUsers = await fetch('http://localhost:3000/api/admin')
            let usersResp = await respUsers.json()
            let users = await usersResp.map((user: any) => ({value: user._id, label: user.name}))
            setUsers(users)
        }
        getUsers()
    },[])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Agregar Evento</Button>
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

                    <div className="flex justify-between items-center gap-2">
                        <Label className="text-right">
                            Especialista
                        </Label>
                        <Combobox arrayValues={users} selectedValue={selectedValue} setSelectedValue={setSelectedValue}/>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} type="button">Save changes</Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}
