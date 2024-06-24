'use client'
import PatientTable from '@/app/dashboard/adminPatients/_components/PatientTable';
import { FC, useState } from 'react'
import Link from "next/link"
import EventsTable from '../eventsTable/EventsTable';
import { CalendarDaysIcon, ExclamationTriangleIcon, FolderIcon, UserIcon } from '@heroicons/react/24/outline';
import ReportsTable from '../ReportsTable';
import MissingReportsTable from '../MissingReportsTable';
import { useQuery } from 'react-query';

const DashboardTabs: FC<{
    userInfo: any,
    userReports: any,
    userEvent: any,
    missingReportsWithDate: any,
    refecthFns: any
}> = ({ userInfo, userReports, userEvent, missingReportsWithDate, refecthFns }) => {
    const { isLoading, error, data: patientList = [], refetch } = useQuery(['patientList'], () =>
        fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/patient`).then(res =>
            res.json()
        ),
        {
            keepPreviousData: true,
            refetchInterval: false,
            refetchOnWindowFocus: false,
        })

    let patientsIdsByUser = userInfo[0]?.asignedPatients.map((patient: any) => patient._id)

    let patientListByUser = patientList.filter((patient: any) => patientsIdsByUser.includes(patient._id) && patient).filter((patient: any) => patient.isActive)

    function isDateWithinRange(today: any, startDate: any, endDate: any, event:any) {
        today = today.setHours(0,0,0,0).toLocaleString("es-VE")
        startDate = new Date(startDate).setHours(0,0,0,0).toLocaleString("es-VE")
        endDate = new Date(endDate).setHours(0,0,0,0).toLocaleString("es-VE")
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

    const userID = userInfo[0]._id
  
    const patientListActivatedOrDesactivated = userInfo[0].asignedPatients.map((patient: any) => {
      if (patient.readySpecialistList.includes(userID) || patient.desactivatedForSpecialistList.includes(userID)) return
      return patient
    })

    const TABLE_HEAD_PATIENT = ["Nombre paciente", "Fecha de nacimiento", "Diagnóstico", "Motivo de Ingreso", "Estatus", "Reportes"];

    const TABLE_HEAD_EVENTS = ["Cita", "Estatus de la cita", "Hora", "Nombre paciente"];
    const TABLE_HEAD_EVENTS_ADMIN = ["Cita", "Estatus de la cita", "Hora", "Nombre paciente", "Estatus paciente", "Especialista", "Acciones"];

    const TABLE_HEAD_REPORTS = ["Descripción", "Creado", "Cita asociada", ""];
    const TABLE_HEAD_REPORTS_ADMIN = ["Usuario", "Fecha de creación", "Descripción reporte", "Cita", "Paciente"];
    const TABLE_HEAD_MISSING_REPORTS = ["Título Evento", "Especialista Asignado", "Paciente", "Fecha del reporte faltante", "Acción"];

    const [selectedCard, setSelectedCard] = useState<
        'patients' | 'events' | 'reports' | 'missingReports'>(userInfo[0]?.role !== 'admin' ? 'patients' : 'events')

    const ActiveCard = {
        'patients': <PatientTable tableHeaders={TABLE_HEAD_PATIENT} patients={patientListActivatedOrDesactivated.filter(Boolean)} />,
        'events': <EventsTable tableHeaders={userInfo[0]?.role !== 'admin' ? TABLE_HEAD_EVENTS : TABLE_HEAD_EVENTS_ADMIN} events={eventForToday(userEvent)} refecthFns={refecthFns} />,
        'reports': <ReportsTable tableHeaders={TABLE_HEAD_REPORTS_ADMIN} reports={userReports} />,
        'missingReports': <MissingReportsTable tableHeaders={TABLE_HEAD_MISSING_REPORTS} missingReportsWithDate={missingReportsWithDate} refecthFns={refecthFns} />
    }

    return (
        <>
            <div className="flex items-start mb-4">
                <div className="container max-w-6xl px-5 my-4">
                    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">

                        {/* MIS PACIENTES */}
                        {userInfo[0]?.role !== 'admin' && (
                            <div onClick={() => setSelectedCard('patients')} className="relative overflow-hidden p-5 bg-amber-50 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer">
                                <div className="flex items-center space-x-2 space-y-3">

                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 ">
                                        <UserIcon className="h-9 w-9 text-amber-400" strokeWidth={2} />
                                    </div>

                                    <div className='flex flex-col items-center'>
                                        <div className="text-amber-800 text-center font-semibold">Mis Pacientes</div>
                                        <div className="text-2xl font-bold text-amber-900">
                                            {patientListActivatedOrDesactivated.filter(Boolean).length}
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
                        <div onClick={() => setSelectedCard('events')} className="relative overflow-hidden p-5 bg-fuchsia-50 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer">
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
                            onClick={() => setSelectedCard('missingReports')}
                            className="relative overflow-hidden p-5 bg-orange-50 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer"
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
                                onClick={() => setSelectedCard('missingReports')}
                                className="relative overflow-hidden p-5 bg-red-50 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer"
                            >
                                <div className="flex items-center space-x-2 space-y-3">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 ">
                                        <ExclamationTriangleIcon className="h-9 w-9 text-red-400" strokeWidth={2} />
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <div className="text-red-800 text-center font-semibold max-w-[150px]">Citas canceladas sin recuperaciones</div>
                                        <div className="text-2xl font-bold text-red-900">0</div>
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
                            <div className="relative overflow-hidden p-5 bg-emerald-50 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer">
                                <div className="flex items-center space-x-2 space-y-3">

                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 ">
                                        <CalendarDaysIcon className="h-9 w-9 text-emerald-400" strokeWidth={2} />
                                    </div>

                                    <div className='flex flex-col items-center'>
                                        <div className="text-esmerald-800 text-center font-semibold">
                                            {/* {userInfo[0]?.role === 'admin' ? 'Reportes' : 'Mis reportes'} */}
                                            Ver Calendario
                                        </div>
                                        <div className="text-2xl font-bold text-esmerald-900 h-[56px]">-</div>
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
            {ActiveCard[selectedCard]}
        </>
    )
}

export default DashboardTabs