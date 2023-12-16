'use client'

import Link from "next/link";
import { ScrollArea } from "../ui/ScrollArea";

const AsideMenuOptions = () => (

    <ScrollArea className="h-[calc(100vh-3.5rem)] rounded-md p-4">

        <h4 className='rounded-md px-2 py-4 text-sm font-semibold'>
            Inicio
        </h4>
        <div className='grid grid-flow-row auto-rows-max text-sm mb-4'>
            <Link className='group flex w-full items-center rounded-md border border-transparent px-2 py-4 hover:underline text-muted-foreground' href="/dashboard">Inicio</Link>
        </div>

        <h4 className='rounded-md px-2 py-4 text-sm font-semibold'>
            Administración de usuarios
        </h4>
        <div className='grid grid-flow-row auto-rows-max text-sm mb-4'>
            <Link className='group flex w-full items-center rounded-md border border-transparent px-2 py-4 hover:underline text-muted-foreground' href="/dashboard/adminUsers">Especialistas</Link>
        </div>
        <div className='grid grid-flow-row auto-rows-max text-sm mb-4'>
            <Link className='group flex w-full items-center rounded-md border border-transparent px-2 py-4 hover:underline text-muted-foreground' href="/dashboard/adminPatients">Pacientes</Link>
        </div>

        <h4 className='rounded-md px-2 py-4 text-sm font-semibold'>
            Calendario
        </h4>
        <div className='grid grid-flow-row auto-rows-max text-sm mb-4'>
            <Link className='group flex w-full items-center rounded-md border border-transparent px-2 py-4 hover:underline text-muted-foreground' href="/dashboard/scheduler">Eventos</Link>
        </div>



    </ScrollArea>
)

export default AsideMenuOptions