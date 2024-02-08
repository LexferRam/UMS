import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import moment from 'moment'
moment.locale('es');
import { calculateAgeWithMonths } from '@/util/dateOfBirth';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import EditEventModal from './EditEventModal';
import { useUserInfo } from '@/hooks';

interface IEventDetailsModal {
    open: boolean
    setOpen: (open: boolean) => void
    eventDetails: any,
    refetchEvents: any
}

const EventDetailsModal = ({
    open,
    setOpen,
    eventDetails,
    refetchEvents
}: IEventDetailsModal) => {

    const [editEvent, setEditEvent] = useState(false)
    const [userInfo] = useUserInfo()

    return (
        <Dialog
            open={open}
            onOpenChange={() => {
                setOpen(!open)
                setEditEvent(false)
            }}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className='flex flex-row gap-4 items-center justify-around'>
                    <div><DialogTitle>{!editEvent ? eventDetails?.title : null}</DialogTitle></div>
                    {!editEvent ? (
                        userInfo[0]?.role === 'admin' ? (
                            <div className='flex gap-1 items-center cursor-pointer' onClick={() => setEditEvent(true)}>
                                <PencilSquareIcon
                                    className="h-6 w-6 text-green-500"
                                />
                                <span
                                    className='text-sm font-semibold text-gray-600'
                                >
                                    Editar todo el evento
                                </span>
                            </div>
                        ) : null
                    ) : (
                        <div className='flex gap-2 items-center cursor-pointer' onClick={() => setEditEvent(false)} >
                            <ArrowLeftIcon
                                className="h-6 w-6 text-green-500"
                            />
                            <span
                                className='text-sm font-semibold text-gray-600'
                            >
                                Volver
                            </span>
                        </div>
                    )}
                </DialogHeader>

                {!editEvent && <>
                    <div className='flex flex-col sm:flex-row'>
                        <b className='mr-2'>Tipo de Evento: </b> <p>{eventDetails?.extendedProps?.eventType}</p>
                    </div>

                    <div className='flex flex-col sm:flex-row'>
                        <b className='mr-2'>Paciente: </b> <p>{eventDetails?.extendedProps?.patient.name + ' ' + eventDetails?.extendedProps?.patient?.lastname}</p>
                    </div>

                    <div className='flex flex-col sm:flex-row'>
                        <b className='mr-2'>Fecha de Nacimiento: </b> <p>{moment(eventDetails?.extendedProps?.patient?.dateOfBirth).format('LL')}</p>
                    </div>

                    <div className='flex flex-col sm:flex-row'>
                        <b className='mr-2'>Edad: </b> <p>{calculateAgeWithMonths(eventDetails?.extendedProps?.patient?.dateOfBirth)?.years} años y {calculateAgeWithMonths(eventDetails?.extendedProps?.patient?.dateOfBirth)?.months} meses</p>
                    </div>

                    <div className='flex flex-col sm:flex-row'>
                        <b className='mr-2'>Diagnóstico: </b> <p>{eventDetails?.extendedProps?.patient?.diagnosis}</p>
                    </div>

                    <div className='flex flex-col sm:flex-row'>
                        <b className='mr-2'>MC: </b> <p>{eventDetails?.extendedProps?.patient?.historyDescription}</p>
                    </div>

                    <div className='flex flex-col sm:flex-row'>
                        <b className='mr-2'>Especialista asignado: </b> <p>{eventDetails?.extendedProps?._asignTo.name}</p>
                    </div>
                </>}

                {editEvent && (
                    <EditEventModal
                        eventDetails={eventDetails} 
                        refetchEvents={refetchEvents} 
                        setOpen={setOpen}
                        setEditEvent={setEditEvent}
                    />
                )}
            </DialogContent>

        </Dialog>
    )
}

export default EventDetailsModal