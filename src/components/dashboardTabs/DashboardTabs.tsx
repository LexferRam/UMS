'use client'
import PatientTable from '@/app/dashboard/adminPatients/_components/PatientTable';
import { eventForToday } from '@/util/dates';
import { FC, useState } from 'react'
import EventsTable from '../eventsTable/EventsTable';
import { CalendarDaysIcon, ExclamationTriangleIcon, FolderIcon, UserIcon } from '@heroicons/react/24/outline';

const DashboardTabs: FC<{ userInfo: any }> = ({ userInfo }) => {

    const TABLE_HEAD_PATIENT = ["Nombre paciente", "Correo", "Estatus", "Acciones"];
    const TABLE_HEAD_EVENTS = ["Cita","Estatus de la cita", "Hora", "Nombre paciente", "Estatus paciente", "Acciones"];
    const [selectedCard, setSelectedCard] = useState<'patients' | 'events'>('patients')

    const ActiveCard = {
        'patients': <PatientTable tableHeaders={TABLE_HEAD_PATIENT} patients={userInfo[0]?.asignedPatients} />,
        'events': <EventsTable tableHeaders={TABLE_HEAD_EVENTS} events={eventForToday(userInfo[0]?.events)} />
    }

    return (
        <>
            <div className="flex items-start">
                <div className="container max-w-6xl px-5 mx-auto my-4">
                    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">

                        <div onClick={() => setSelectedCard('patients')} className="relative overflow-hidden p-5 bg-amber-50 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer">
                            <div className="flex items-center space-x-2 space-y-3">

                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 ">
                                    <UserIcon className="h-9 w-9 text-amber-400" strokeWidth={2} />
                                </div>

                                <div className='flex flex-col items-center'>
                                    <div className="text-amber-800 text-center font-semibold">Mis Pacientes</div>
                                    <div className="text-2xl font-bold text-amber-900">{userInfo[0]?.asignedPatients.length}</div>
                                </div>

                                <div>
                                    <div className='absolute -top-1/4 -right-12 w-[100px] h-[100px] bg-amber-200 rounded-full opacity-40' />
                                    <div className='absolute -bottom-1/4 -right-16 w-[100px] h-[100px] bg-amber-200 rounded-full opacity-40' />
                                    <div className='absolute -bottom-1/4 -left-16 w-[100px] h-[100px] bg-amber-200 rounded-full opacity-40' />
                                    <div className='absolute -top-1/4 -left-16 w-[100px] h-[100px] bg-amber-200 rounded-full opacity-40' />
                                </div>

                            </div>
                        </div>

                        <div onClick={() => setSelectedCard('events')} className="relative overflow-hidden p-5 bg-fuchsia-50 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer">
                            <div className="flex items-center space-x-2 space-y-3">

                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-50 ">
                                    <CalendarDaysIcon className="h-9 w-9 text-fuchsia-400" strokeWidth={2} />
                                </div>

                                <div className='flex flex-col items-center'>
                                    <div className="text-fuchsia-800 text-center font-semibold">Citas para hoy</div>
                                    <div className="text-2xl font-bold text-fuchsia-900">{eventForToday(userInfo[0]?.events)?.length}</div>
                                </div>

                                <div>
                                    <div className='absolute -top-1/4 -right-12 w-[100px] h-[100px] bg-fuchsia-200 rounded-full opacity-40' />
                                    <div className='absolute -bottom-1/4 -right-16 w-[100px] h-[100px] bg-fuchsia-200 rounded-full opacity-40' />
                                    <div className='absolute -bottom-1/4 -left-16 w-[100px] h-[100px] bg-fuchsia-200 rounded-full opacity-40' />
                                    <div className='absolute -top-1/4 -left-16 w-[100px] h-[100px] bg-fuchsia-200 rounded-full opacity-40' />
                                </div>

                            </div>
                        </div>

                        <div onClick={() => setSelectedCard('patients')} className="relative overflow-hidden p-5 bg-emerald-50 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer">
                            <div className="flex items-center space-x-2 space-y-3">

                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 ">
                                    <FolderIcon className="h-9 w-9 text-emerald-400" strokeWidth={2} />
                                </div>

                                <div className='flex flex-col items-center'>
                                    <div className="text-esmerald-800 text-center font-semibold">Mis reportes</div>
                                    <div className="text-2xl font-bold text-esmerald-900">0</div>
                                </div>

                                <div>
                                    <div className='absolute -top-1/4 -right-12 w-[100px] h-[100px] bg-emerald-200 rounded-full opacity-40' />
                                    <div className='absolute -bottom-1/4 -right-16 w-[100px] h-[100px] bg-emerald-200 rounded-full opacity-40' />
                                    <div className='absolute -bottom-1/4 -left-16 w-[100px] h-[100px] bg-emerald-200 rounded-full opacity-40' />
                                    <div className='absolute -top-1/4 -left-16 w-[100px] h-[100px] bg-emerald-200 rounded-full opacity-40' />
                                </div>

                            </div>
                        </div>

                        <div
                            onClick={() => setSelectedCard('events')}
                            className="relative overflow-hidden p-5 bg-orange-50 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer"
                        >
                            <div className="flex items-center space-x-2 space-y-3">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 ">
                                    <ExclamationTriangleIcon className="h-9 w-9 text-orange-400" strokeWidth={2} />
                                </div>
                                <div className='flex flex-col items-center'>
                                    <div className="text-orange-800 text-center font-semibold">Reportes faltantes</div>
                                    <div className="text-2xl font-bold text-orange-900">{eventForToday(userInfo[0]?.events).length}</div>
                                </div>
                                <div>
                                    <div className='absolute -top-1/4 -right-12 w-[100px] h-[100px] bg-orange-200 rounded-full opacity-40' />
                                    <div className='absolute -bottom-1/4 -right-16 w-[100px] h-[100px] bg-orange-200 rounded-full opacity-40' />
                                    <div className='absolute -bottom-1/4 -left-16 w-[100px] h-[100px] bg-orange-200 rounded-full opacity-40' />
                                    <div className='absolute -top-1/4 -left-16 w-[100px] h-[100px] bg-orange-200 rounded-full opacity-40' />
                                </div>
                            </div>



                        </div>

                    </div>
                </div>
            </div>
            {ActiveCard[selectedCard]}
        </>
    )
}

export default DashboardTabs