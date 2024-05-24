import React, { useContext, useState } from 'react'
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
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { EVENTS_TYPE_COLORS } from '@/util/eventsType';
import { ModalContext } from '@/context/NotificationDialogProvider';
import NotificationDialog from './NotificationDialog';
import { LoadingContext } from '@/context/LoadingProvider';
import { useSnackbar } from 'notistack';
import { Alert } from '@mui/material';

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

    const router = useRouter()
    const [editEvent, setEditEvent] = useState(false)
    const [cancelEvent, setCancelEvent] = useState(false)
    const [userInfo] = useUserInfo()

    let isRecurrentEvent = eventDetails?.byweekday?.length || false
    let hasReports = eventDetails?.reports?.length || false

    const dateParts = selectedDate?.date.split("/")

    const year = dateParts && parseInt(dateParts[2], 10);
    const month = dateParts && parseInt(dateParts[1], 10) - 1; 
    const day = dateParts && parseInt(dateParts[0], 10);

    const newEndDate = dateParts && new Date(year, month, day);

    const {openModal, setOpenModal, setDialogMessage, handleClickOpen, handleClose} = useContext(ModalContext) as any
    const { setLoading } = useContext(LoadingContext) as any
    const { enqueueSnackbar } = useSnackbar()

    const canceledReportInSelectedDate = eventDetails?.reports?.map((report: any) => {
        return {
            ...report,
            createdAt: new Date(report?.createdAt)?.toLocaleString("es-VE")?.split(',')[0]
        }
    }).filter((report: any) => report.createdAt === selectedDate?.date)[0]

    console.log(canceledReportInSelectedDate)

    const deleteEvent = async () => {
        try {
            setLoading(true)
            await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/events/${eventDetails?._id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                }
            })

            await refetchEvents()
            setLoading(false)
            enqueueSnackbar('Cita eliminada exitosamente', {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
                autoHideDuration: 5000,
                key: 'error-delete-event'
            })

        } catch (error) {
            console.log(error)
            setLoading(false)
            enqueueSnackbar('Error eliminando cita', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
                autoHideDuration: 5000,
                key: 'error-delete-event'
            })
        }
    }

    return (
        <>
            <NotificationDialog handleDeleteAction={deleteEvent}/>
            <Dialog
                open={open}
                onOpenChange={() => {
                    setOpen(!open)
                    setEditEvent(false)
                    setCancelEvent(false)
                }}
            >
                <DialogContent className="sm:max-w-[500px]" >

                    <ScrollArea className='max-h-[550px] sm:max-h-[500px]'>
                        {/* // ! DIALOG HEADER  */}
                        <DialogHeader className='flex flex-row gap-4 items-center justify-center mb-4'>
                            <div>
                                <DialogTitle>
                                    {!editEvent ? eventDetails?.title : null}
                                    <span
                                        className="ml-2 inline-block rounded-full px-3 py-1 text-[10px] font-light text-white mr-2 mb-1"
                                        style={{
                                            backgroundColor: EVENTS_TYPE_COLORS[eventDetails?.eventType]
                                        }}
                                    >
                                        {eventDetails?.eventType}
                                    </span>
                                </DialogTitle>
                                <hr className='w-full' />
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

                            <div className='w-full mt-2 mb-4'>
                                {canceledReportInSelectedDate?.description?.length && canceledReportInSelectedDate?.isForEventCancel && (
                                    <Alert severity="error" className='w-[100%]'>
                                        {canceledReportInSelectedDate?.description}
                                    </Alert>
                                )}
                            </div>

                            <div className='flex flex-col sm:flex-row mt-1'>
                                <b className='mr-2'>Paciente: </b> <p className='font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer' onClick={() => {
                                    if (!eventDetails?.patient.reports.length) return
                                    router.push(`/dashboard/patientHistory/${eventDetails?.patient?._id}`, { scroll: false })
                                }}>{eventDetails?.patient.name + ' ' + eventDetails?.patient?.lastname}</p>
                            </div>

                            <div className='flex flex-col sm:flex-row mt-1'>
                                <b className='mr-2'>Fecha de Nacimiento: </b> <p className='mr-2'>{moment(eventDetails?.patient?.dateOfBirth).format('LL')}</p>
                                <p className='text-sm'>{calculateAgeWithMonths(eventDetails?.patient?.dateOfBirth)?.years} años y {calculateAgeWithMonths(eventDetails?.patient?.dateOfBirth)?.months} meses</p>
                            </div>

                            <div className='flex flex-col sm:flex-row mt-1'>
                                <b className='mr-2'>Diagnóstico: </b> <p>{eventDetails?.patient?.diagnosis}</p>
                            </div>

                            <div className='flex flex-col sm:flex-row mt-1 mb-4'>
                                <b className='mr-2'>MC: </b> <p>{eventDetails?.patient?.historyDescription}</p>
                            </div>

                            <hr />

                            <div className='flex flex-col sm:flex-row mt-4'>
                                <b className='mr-2'>Especialista asignado: </b> <p>{eventDetails?._asignTo.name}</p>
                            </div>

                            <div className='flex flex-col mb-4'>
                                <b className='my-2'>Especialistas asignados: </b>

                                <div className='flex flex-row gap-5'>
                                    {selectedDate?.patient?.specialistAssigned?.map((specialist: any) => {
                                        return (
                                            <div className='flex flex-col items-center justify-center gap-2' key={specialist._id}>
                                                <Image
                                                    src={specialist.lastname}
                                                    className="rounded-full"
                                                    alt='logo_login'
                                                    width={48}
                                                    height={48}
                                                    priority
                                                />
                                                <p
                                                    color="blue-gray"
                                                    className="font-normal text-clip text-sm text-gray-500"
                                                >
                                                    {specialist.name}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <hr />


                            <div className='flex flex-col sm:flex-row'>
                                {(userInfo[0]?.role === 'admin') ? (
                                    <div className='flex flex-col gap-2 '>
                                        {/* TODO: editar el evento actual */}
                                        {/* <div className='flex gap-1 items-center cursor-not-allowed' onClick={() => setEditEvent(false)}>
                                        <PencilSquareIcon
                                            className="h-6 w-6 text-blue-500"
                                        />
                                        <span
                                            className='text-sm font-semibold text-blue-600'
                                        >
                                            Editar el evento actual
                                        </span>
                                    </div> */}

                                        <div className='flex gap-1 mt-4 items-center cursor-pointer' onClick={() => setEditEvent(true)}>
                                            <PencilSquareIcon
                                                className="h-4 w-4 text-green-500"
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
                                                        className="h-4 w-4 text-orange-500"
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

                                                        await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/events/eventId?eventId`, {
                                                            method: 'PUT',
                                                            headers: {
                                                                "Content-Type": "application/json"
                                                            },
                                                            body: JSON.stringify({
                                                                newEndDate,
                                                                _id: eventDetails?._id
                                                            })
                                                        })

                                                        setOpen(false)
                                                        await refetchEvents()

                                                    } catch (error) {
                                                        console.log(error)
                                                    }
                                                }}
                                            >
                                                <TrashIcon
                                                    className="h-4 w-4 text-orange-500"
                                                />
                                                <span
                                                    className='text-sm font-semibold text-orange-600'
                                                >
                                                    Eliminar evento a partir de ésta cita
                                                </span>
                                            </div>
                                        )}

                                        {!hasReports && (
                                            <div
                                                className='flex gap-1 items-center cursor-pointer'
                                                onClick={async () => {
                                                    setOpenModal(true)
                                                    setDialogMessage('¿Estás seguro de eliminar esta cita?')
                                                    setOpen(false)
                                                }} >
                                                <TrashIcon
                                                    className="h-4 w-4 text-red-500"
                                                />
                                                <span
                                                    className='text-[13px] font-semibold text-red-500'
                                                >
                                                    Eliminar Cita
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
        </>
    )
}

const CancelEventReportForm = ({ eventId, patient, dateOfMissingReport, refetchEvents, setOpen, setEditEvent, setCancelEvent }: any) => {
    const [isAddingReport, setIsAddingReport] = useState(false)
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const { enqueueSnackbar } = useSnackbar()
    const { setLoading } = useContext(LoadingContext) as any

    let datePortion = dateOfMissingReport?.split('/')
    let formatDate = new Date(datePortion[2], datePortion[1] - 1, datePortion[0])

    const handleClick = async (data: any) => {
       try {

        setIsAddingReport(true)
        setLoading(true)

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
            enqueueSnackbar('Reporte agregado exitosamente', {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
                autoHideDuration: 5000,
                key: 'error-delete-event'
            })
            setLoading(false)
            return
        }
       } catch (error) {
        console.error(error)
        setLoading(false)
        setOpen(false)
        enqueueSnackbar('Error agregando reporte', {
            variant: 'error',
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
            },
            autoHideDuration: 5000,
            key: 'error-delete-event'
        })
       }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(handleClick)}>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col justify-start items-center gap-4">
                        <Alert severity="warning" className='w-[100%]'>En caso de cancelación, no enviar reporte. El administrador lo agregará.</Alert>
                        <Textarea
                            placeholder="Agregue el motivo de cancelación de éste evento"
                            defaultValue=""
                            {...register("description",
                                {
                                    required: 'Ingrese la descripción del reporte',
                                    min: { value: 10, message: "Agregue una descripción mas extensa" }
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