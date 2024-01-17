import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import moment from 'moment'
moment.locale('es');
import { calculateAgeWithMonths } from '@/util/dateOfBirth';

interface IEventDetailsModal {
    open: boolean
    setOpen: (open: boolean) => void
    eventDetails: any
}

const EventDetailsModal = ({
    open,
    setOpen,
    eventDetails
}: IEventDetailsModal) => {

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{eventDetails?.title}</DialogTitle>
                </DialogHeader>

                <div className='flex flex-col sm:flex-row'>
                    <b className='mr-2'>Tipo de Evento: </b> <p>{eventDetails?.extendedProps?.eventType}</p>
                </div>

                <div className='flex flex-col sm:flex-row'>
                    <b className='mr-2'>Paciente: </b> <p>{eventDetails?.extendedProps?.patient.name+' '+eventDetails?.extendedProps?.patient?.lastname}</p>
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
            </DialogContent>

        </Dialog>
    )
}

export default EventDetailsModal