'use client'
import { FC, Suspense, useRef, useState } from 'react'
import Link from "next/link"
import dynamic from 'next/dynamic';
import EventsTable from '../eventsTable/EventsTable';
import { CalendarDaysIcon, ExclamationTriangleIcon, FolderIcon, UserIcon } from '@heroicons/react/24/outline';
import AdmiPageSkeleton from '@/app/dashboard/adminPatients/_components/AdmiPageSkeleton';

const MissingReportsTable = dynamic(() => import("../MissingReportsTable"),{
    ssr: true,
    loading: () => <AdmiPageSkeleton/>
})
const ReportsTable = dynamic(() => import("../ReportsTable"),{
    ssr: true,
    loading: () => <AdmiPageSkeleton/>
})
const PatientTable = dynamic(() => import("@/app/dashboard/adminPatients/_components/PatientTable"),{
    ssr: true,
    loading: () => <AdmiPageSkeleton/>
})

const DashboardTabs: FC<{
    userInfo: any,
    userReports: any,
    userEvent: any,
    missingReportsWithDate: any,
    refecthFns: any
}> = ({ userInfo, userReports, userEvent, missingReportsWithDate, refecthFns }) => {
    const tableContainerRef = useRef(null) as any;

    function isDateWithinRange(today: any, startDate: any, endDate: any, event: any) {
        today = today.setHours(0, 0, 0, 0).toLocaleString("es-VE")
        startDate = new Date(startDate).setHours(0, 0, 0, 0).toLocaleString("es-VE")
        endDate = new Date(endDate).setHours(0, 0, 0, 0).toLocaleString("es-VE")
        return today >= startDate && today <= endDate;
    }

    const eventForToday = (eventsArray: any) => {
        let daysWeek: any = {
            mo: 1,
            tu: 2,
            we: 3,
            th: 4,
            fr: 5,
            sa: 6,
            su: 7
        }

        let eventsForTodayArray: any[] = []

        eventsArray?.map((event: any) => {
            const today = new Date();
            if (event.byweekday.length > 0) {
                event.byweekday.forEach((dayWeek: any) => {
                    if (daysWeek[dayWeek] === today.getDay()) {
                        isDateWithinRange(today, event.start, event.end, event) && eventsForTodayArray.push(event)
                    }
                })
            }
            if (event.byweekday.length === 0) {
                isDateWithinRange(today, event.start, event.end, event) && eventsForTodayArray.push(event)
            }
        })

        return eventsForTodayArray
    }

    const userID = userInfo[0]?._id

    const patientListActivatedOrDesactivated = userInfo[0]?.asignedPatients?.map((patient: any) => {
        if (patient.readySpecialistList.includes(userID) || patient.desactivatedForSpecialistList.includes(userID)) return
        return patient
    })

    const TABLE_HEAD_PATIENT = ["Nombre paciente", "Fecha de nacimiento", "Diagnóstico", "Motivo de Ingreso", "Reportes"];

    const TABLE_HEAD_MISSING_REPORTS = ["Título Evento", "Especialista Asignado", "Paciente", "Fecha del reporte faltante", "Acción"];

    const [selectedCard, setSelectedCard] = useState<
        'patients' | 'events' | 'missingReports' | 'cancelEventsWithoutRecovery'>(userInfo[0]?.role !== 'admin' ? 'patients' : 'events')

    const ActiveCard = {
        'patients': (
            <Suspense>
                <PatientTable
                    tableHeaders={TABLE_HEAD_PATIENT}
                    patients={patientListActivatedOrDesactivated?.filter(Boolean)}
                />
            </Suspense>
        ),
        'events': (
            <Suspense>
                <EventsTable
                    events={eventForToday(userEvent)}
                    userRole={userInfo[0]?.role}
                />
            </Suspense>
        ),
        'missingReports': (
            <Suspense>
                <MissingReportsTable
                    tableHeaders={TABLE_HEAD_MISSING_REPORTS}
                    missingReportsWithDate={missingReportsWithDate}
                    refecthFns={refecthFns} /
                >
            </Suspense>
        ),
        'cancelEventsWithoutRecovery': (
            <Suspense>
                <ReportsTable reports={userReports} refecthFns={refecthFns} />
            </Suspense>
        )
    }

    return (
        <>
            <div className="flex items-start mb-4">
                <div className="container max-w-6xl px-5 my-4">
                    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">

                        {/* MIS PACIENTES */}
                        {userInfo[0]?.role !== 'admin' && (
                            <div onClick={() => {
                                setSelectedCard('patients')
                                tableContainerRef.current.scrollIntoView({ behavior: 'smooth' })
                            }}
                                className="relative overflow-hidden p-5 bg-amber-50 rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer"
                            >
                                <div className="flex items-center space-x-2 space-y-3">

                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 ">
                                        <UserIcon className="h-9 w-9 text-amber-400" strokeWidth={2} />
                                    </div>

                                    <div className='flex flex-col items-center'>
                                        <div className="text-amber-800 text-center font-semibold">Mis Pacientes</div>
                                        <div className="text-2xl font-bold text-amber-900">
                                            {patientListActivatedOrDesactivated?.filter(Boolean).length}
                                        </div>
                                    </div>

                                    <div>
                                        <div className='absolute -top-1/4 -right-12 w-[100px] h-[100px] bg-amber-200 rounded-full opacity-40' />
                                        <div className='absolute -bottom-1/4 -right-16 w-[100px] h-[100px] bg-amber-200 rounded-full opacity-40' />
                                        <div className='absolute -bottom-1/4 -left-16 w-[100px] h-[100px] bg-amber-200 rounded-full opacity-40' />
                                        <div className='absolute -top-1/4 -left-16 w-[100px] h-[100px] bg-amber-200 rounded-full opacity-40' />
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* CITAS PARA HOY */}
                        <div
                            onClick={() => {
                                setSelectedCard('events')
                                tableContainerRef.current.scrollIntoView({ behavior: 'smooth' })
                            }}
                            className="relative overflow-hidden p-5 bg-fuchsia-50 rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer"
                        >
                            <div className="flex items-center space-x-2 space-y-3">

                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-50 ">
                                    <FolderIcon className="h-9 w-9 text-fuchsia-400" strokeWidth={2} />
                                </div>

                                <div className='flex flex-col items-center'>
                                    <div className="text-fuchsia-800 text-center font-semibold">Citas para hoy</div>
                                    <div className="text-2xl font-bold text-fuchsia-900">{eventForToday(userEvent)?.length}</div>
                                </div>

                                <div>
                                    <div className='absolute -top-1/4 -right-12 w-[100px] h-[100px] bg-fuchsia-200 rounded-full opacity-40' />
                                    <div className='absolute -bottom-1/4 -right-16 w-[100px] h-[100px] bg-fuchsia-200 rounded-full opacity-40' />
                                    <div className='absolute -bottom-1/4 -left-16 w-[100px] h-[100px] bg-fuchsia-200 rounded-full opacity-40' />
                                    <div className='absolute -top-1/4 -left-16 w-[100px] h-[100px] bg-fuchsia-200 rounded-full opacity-40' />
                                </div>

                            </div>
                        </div>

                        {/* REPORTES FALTANTES */}
                        <div
                            onClick={() => {
                                setSelectedCard('missingReports')
                                tableContainerRef.current.scrollIntoView({ behavior: 'smooth' })
                            }}
                            className="relative overflow-hidden p-5 bg-orange-50 rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer"
                        >
                            <div className="flex items-center space-x-2 space-y-3">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 ">
                                    <ExclamationTriangleIcon className="h-9 w-9 text-orange-400" strokeWidth={2} />
                                </div>
                                <div className='flex flex-col items-center'>
                                    <div className="text-orange-800 text-center font-semibold">Reportes faltantes</div>
                                    <div className="text-2xl font-bold text-orange-900">{missingReportsWithDate?.length}</div>
                                </div>
                                <div>
                                    <div className='absolute -top-1/4 -right-12 w-[100px] h-[100px] bg-orange-200 rounded-full opacity-40' />
                                    <div className='absolute -bottom-1/4 -right-16 w-[100px] h-[100px] bg-orange-200 rounded-full opacity-40' />
                                    <div className='absolute -bottom-1/4 -left-16 w-[100px] h-[100px] bg-orange-200 rounded-full opacity-40' />
                                    <div className='absolute -top-1/4 -left-16 w-[100px] h-[100px] bg-orange-200 rounded-full opacity-40' />
                                </div>
                            </div>



                        </div>

                        {/* CITAS CANCELADAS CON SIN RECUPERACIONES */}
                        {userInfo[0]?.role === 'admin' && (
                            <div
                                onClick={() => {
                                    setSelectedCard('cancelEventsWithoutRecovery')
                                    tableContainerRef.current.scrollIntoView({ behavior: 'smooth' })
                                }}
                                className="relative overflow-hidden p-5 bg-red-50 rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer"
                            >
                                <div className="flex items-center space-x-2 space-y-3">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 ">
                                        <ExclamationTriangleIcon className="h-9 w-9 text-red-400" strokeWidth={2} />
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <div className="text-red-800 text-center font-semibold max-w-[150px]">Citas canceladas sin recuperaciones</div>
                                        <div className="text-2xl font-bold text-red-900">
                                            {userReports?.length}
                                        </div>
                                    </div>
                                    <div>
                                        <div className='absolute -top-1/4 -right-12 w-[100px] h-[100px] bg-red-200 rounded-full opacity-40' />
                                        <div className='absolute -bottom-1/4 -right-16 w-[100px] h-[100px] bg-red-200 rounded-full opacity-40' />
                                        <div className='absolute -bottom-1/4 -left-16 w-[100px] h-[100px] bg-red-200 rounded-full opacity-40' />
                                        <div className='absolute -top-1/4 -left-16 w-[100px] h-[100px] bg-red-200 rounded-full opacity-40' />
                                    </div>
                                </div>



                            </div>
                        )}

                        {/*VER CALENDARIO */}
                        <Link
                            href="/dashboard/scheduler">
                            <div className="relative overflow-hidden p-5 bg-emerald-50 rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer">
                                <div className="flex items-center space-x-2 space-y-3">

                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 ">
                                        <CalendarDaysIcon className="h-9 w-9 text-emerald-400" strokeWidth={2} />
                                    </div>

                                    <div className='flex flex-col items-center'>
                                        <div className="text-esmerald-800 text-center font-semibold">
                                            Ver Calendario
                                        </div>
                                        <div className="text-2xl font-bold text-esmerald-900 h-[56px]"></div>
                                    </div>

                                    <div>
                                        <div className='absolute -top-1/4 -right-12 w-[100px] h-[100px] bg-emerald-200 rounded-full opacity-40' />
                                        <div className='absolute -bottom-1/4 -right-16 w-[100px] h-[100px] bg-emerald-200 rounded-full opacity-40' />
                                        <div className='absolute -bottom-1/4 -left-16 w-[100px] h-[100px] bg-emerald-200 rounded-full opacity-40' />
                                        <div className='absolute -top-1/4 -left-16 w-[100px] h-[100px] bg-emerald-200 rounded-full opacity-40' />
                                    </div>

                                </div>
                            </div>
                        </Link>

                    </div>
                </div>
            </div>
            <div ref={tableContainerRef}>
                {ActiveCard[selectedCard]}
            </div>
        </>
    )
}

export default DashboardTabs