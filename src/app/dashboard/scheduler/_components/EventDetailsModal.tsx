import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import moment from 'moment'
moment.locale('es');
import { calculateAgeWithMonths } from '@/util/dateOfBirth';
import { PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import EditEventModal from './EditEventModal';
import { useUserInfo } from '@/hooks';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { ScrollArea } from '@/components/ui/ScrollArea';

interface IEventDetailsModal {
    open: boolean
    setOpen: (open: boolean) => void
    eventDetails: any,
    refetchEvents: any,
    selectedDate: any
}

const EventDetailsModal = ({
    open,
    setOpen,
    eventDetails,
    refetchEvents,
    selectedDate
}: IEventDetailsModal) => {

    const [editEvent, setEditEvent] = useState(false)
    const [cancelEvent, setCancelEvent] = useState(false)
    const [userInfo] = useUserInfo()


    let isRecurrentEvent = eventDetails?.byweekday?.length || false

    const dateParts = selectedDate?.date.split("/")

    const year = dateParts && parseInt(dateParts[2], 10);
    const month = dateParts && parseInt(dateParts[1], 10) - 1; 
    const day = dateParts && parseInt(dateParts[0], 10);

    const newEndDate = dateParts && new Date(year, month, day);

    return (
        <Dialog
            open={open}
            onOpenChange={() => {
                setOpen(!open)
                setEditEvent(false)
                setCancelEvent(false)
            }}
        >
            <DialogContent className="sm:max-w-[500px]">

                <ScrollArea className='max-h-[400px] sm:max-h-[400px]'>
                    {/* // ! DIALOG HEADER  */}
                    <DialogHeader className='flex flex-row gap-4 items-center justify-start'>
                        <div>
                            <DialogTitle>
                                {!editEvent ? eventDetails?.title : null}
                            </DialogTitle>
                        </div>

                        {editEvent && (
                            <div
                                className='flex gap-2 items-center cursor-pointer'
                                onClick={() => {
                                    setCancelEvent(false)
                                    setEditEvent(false)
                                }} >
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

                    {/* // ! DETAILS OF THE EVENT  */}
                    {!editEvent && <>
                        <div className='flex flex-col sm:flex-row'>
                            <b className='mr-2'>Tipo de Evento: </b> <p>{eventDetails?.eventType}</p>
                        </div>

                        <div className='flex flex-col sm:flex-row'>
                            <b className='mr-2'>Paciente: </b> <p>{eventDetails?.patient.name + ' ' + eventDetails?.patient?.lastname}</p>
                        </div>

                        <div className='flex flex-col sm:flex-row'>
                            <b className='mr-2'>Fecha de Nacimiento: </b> <p>{moment(eventDetails?.patient?.dateOfBirth).format('LL')}</p>
                        </div>

                        <div className='flex flex-col sm:flex-row'>
                            <b className='mr-2'>Edad: </b> <p>{calculateAgeWithMonths(eventDetails?.patient?.dateOfBirth)?.years} años y {calculateAgeWithMonths(eventDetails?.patient?.dateOfBirth)?.months} meses</p>
                        </div>

                        <div className='flex flex-col sm:flex-row'>
                            <b className='mr-2'>Diagnóstico: </b> <p>{eventDetails?.patient?.diagnosis}</p>
                        </div>

                        <div className='flex flex-col sm:flex-row'>
                            <b className='mr-2'>MC: </b> <p>{eventDetails?.patient?.historyDescription}</p>
                        </div>

                        <div className='flex flex-col sm:flex-row'>
                            <b className='mr-2'>Especialista asignado: </b> <p>{eventDetails?._asignTo.name}</p>
                        </div>

                        <div className='flex flex-col sm:flex-row'>
                            {(userInfo[0]?.role === 'admin') ? (
                                <div className='flex flex-col gap-2 '>
                                    <div className='flex gap-1 items-center cursor-not-allowed' onClick={() => setEditEvent(false)}>
                                        <PencilSquareIcon
                                            className="h-6 w-6 text-blue-500"
                                        />
                                        <span
                                            className='text-sm font-semibold text-blue-600'
                                        >
                                            Editar el evento actual
                                        </span>
                                    </div>

                                    <div className='flex gap-1 items-center cursor-pointer' onClick={() => setEditEvent(true)}>
                                        <PencilSquareIcon
                                            className="h-6 w-6 text-green-500"
                                        />
                                        <span
                                            className='text-sm font-semibold text-green-600'
                                        >
                                            Editar todo el evento
                                        </span>
                                    </div>

                                    {
                                        // ? si el evento no tiene reporte para la fecha seleccionada, se habilita el boton de "cancelar este evento"
                                        eventDetails?.reports?.map((report: any) => new Date(report?.createdAt)?.toLocaleString("es-VE")?.split(',')[0])?.filter((rep: string) => rep === selectedDate?.date).length === 0 && (
                                            <div
                                                className='flex gap-1 items-center cursor-pointer'
                                                onClick={() => {
                                                    setEditEvent(true)
                                                    setCancelEvent(true)
                                                }}>
                                                <XMarkIcon
                                                    className="h-6 w-6 text-orange-500"
                                                />
                                                <span
                                                    className='text-sm font-semibold text-orange-600'
                                                >
                                                    Cancelar éste evento
                                                </span>
                                            </div>
                                        )
                                    }

                                    {eventDetails?.reports?.map((report: any) => new Date(report?.createdAt)?.toLocaleString("es-VE")?.split(',')[0])?.filter((rep: string) => rep === selectedDate?.date).length === 0 && isRecurrentEvent && (
                                        <div
                                            className='flex gap-1 items-center cursor-pointer'
                                            onClick={async () => {
                                                try {

                                                    await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/events/${eventDetails?._id}`, {
                                                        method: 'PUT',
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify({ newEndDate })
                                                    })

                                                    setOpen(false)
                                                    await refetchEvents()

                                                } catch (error) {
                                                    console.log(error)
                                                }
                                            }}
                                        >
                                            <TrashIcon
                                                className="h-6 w-6 text-orange-500"
                                            />
                                            <span
                                                className='text-sm font-semibold text-orange-600'
                                            >
                                                Eliminar evento a partir de ésta cita
                                            </span>
                                        </div>
                                    )}

                                </div>
                            ) : null}


                        </div>
                    </>}

                    {/* // ! EDIT THE WHOLE EVENT  */}
                    {editEvent && !cancelEvent && (
                        <EditEventModal
                            eventDetails={eventDetails}
                            refetchEvents={refetchEvents}
                            setOpen={setOpen}
                            setEditEvent={setEditEvent}
                            userInfo={userInfo}
                        />
                    )}

                    {/* // ! CANCEL THE EVENT  */}
                    {cancelEvent && (
                        <CancelEventReportForm
                            eventId={selectedDate.eventId}
                            patient={selectedDate.patient}
                            dateOfMissingReport={selectedDate.date}
                            refetchEvents={refetchEvents}
                            setOpen={setOpen}
                            setEditEvent={setEditEvent}
                            setCancelEvent={setCancelEvent}
                        />
                    )}
                </ScrollArea>

            </DialogContent>

        </Dialog>
    )
}

const CancelEventReportForm = ({ eventId, patient, dateOfMissingReport, refetchEvents, setOpen, setEditEvent, setCancelEvent }: any) => {
    const [isAddingReport, setIsAddingReport] = useState(false)
    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    let datePortion = dateOfMissingReport?.split('/')
    let formatDate = new Date(datePortion[2], datePortion[1] - 1, datePortion[0])

    const handleClick = async (data: any) => {
        setIsAddingReport(true)

        let reportForCancelEvent = {
            description: data.description,
            associatedEvent: eventId,
            patient: patient._id,
            createdAt: formatDate,
            isForEventCancel: true
        }

        const respAddReport = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/reports`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reportForCancelEvent)
        })
        if (respAddReport.ok) {
            await refetchEvents(),
                reset();
            setOpen(false)
            setEditEvent(false)
            setCancelEvent(false)
            setIsAddingReport(false)
            return
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(handleClick)}>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col justify-start items-center gap-4">
                        <Textarea
                            placeholder="Agregue el motivo de cancelación de éste evento"
                            defaultValue=""
                            {...register("description",
                                {
                                    required: 'Ingrese la descripción del reporte',
                                    min: { value: 4, message: "Agregue una descripción mas extensa" }
                                })}
                            className="h-[250px]"
                        />
                        {errors.description && <p className="text-red-700">{JSON.stringify(errors?.description?.message)}</p>}
                    </div>
                </div>

                <DialogFooter>
                    <button
                        className=" w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ffc260] hover:bg-[#f8b84e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f8fafc]"
                        type="submit"
                        disabled={isAddingReport}
                    >
                        {isAddingReport ? "Guardando..." : "Guardar reporte" }
                    </button>
                </DialogFooter>
            </form>
        </div>
    )
}

export default EventDetailsModal