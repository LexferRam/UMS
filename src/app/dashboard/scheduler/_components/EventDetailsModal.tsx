import React, { useContext, useEffect, useState } from 'react'
import {
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog"
import moment from 'moment'
import { calculateAge, calculateAgeWithMonths } from '@/util/dateOfBirth';
import { CameraIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import EditEventModal from './EditEventModal';
import { useUserInfo } from '@/hooks';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { EVENTS_TYPE_COLORS } from '@/util/eventsType';
import { ModalContext } from '@/context/NotificationDialogProvider';
import NotificationDialog from './NotificationDialog';
import { LoadingContext } from '@/context/LoadingProvider';
import { useSnackbar } from 'notistack';
import { Alert, Dialog, DialogContent, DialogProps, IconButton, Paper, PaperProps, Tooltip } from '@mui/material';
import { weekDays } from '@/util/weekDays';
import Draggable from 'react-draggable';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
moment.locale('es');

interface IEventDetailsModal {
    open: boolean
    setOpen: (open: boolean) => void
    eventDetails: any,
    refetchEvents: any,
    selectedDate: any,
    isPatientActive: any
}

function PaperComponent(props: PaperProps) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

const EventDetailsModal = ({
    open,
    setOpen,
    eventDetails,
    refetchEvents,
    selectedDate,
    isPatientActive
}: IEventDetailsModal) => {

    const router = useRouter()
    const [editEvent, setEditEvent] = useState(false)
    const [cancelEvent, setCancelEvent] = useState(false)
    const [scroll, setScroll] = useState<DialogProps['scroll']>('paper');
    const [activePatient, setActivePatient] = useState(isPatientActive)

    const [userInfo] = useUserInfo()
    let patientID = selectedDate?.patient?._id

    let isRecurrentEvent = eventDetails?.byweekday?.length || false
    let hasReports = eventDetails?.reports?.length || false

    const dateParts = selectedDate?.date.split("/")

    const year = dateParts && parseInt(dateParts[2], 10);
    const month = dateParts && parseInt(dateParts[1], 10) - 1;
    const day = dateParts && parseInt(dateParts[0], 10);

    const newEndDate = dateParts && new Date(year, month, day);

    const { setOpenModal, setDialogMessage } = useContext(ModalContext) as any
    const { setLoading } = useContext(LoadingContext) as any
    const { enqueueSnackbar } = useSnackbar()
    const [showMore, setShowMore] = useState(false)

    const canceledReportInSelectedDate = eventDetails?.reports?.map((report: any) => {
        return {
            ...report,
            createdAt: new Date(report?.createdAt?.split('T')[0]?.replace(/-/g, "/"))?.toISOString()?.split('T')[0]
        }
    }).filter((report: any) => report.createdAt === new Date((selectedDate?.date.split('/')[2] + '-' + selectedDate?.date.split('/')[1] + '-' + selectedDate?.date.split('/')[0])?.replace(/-/g, "/"))?.toISOString()?.split('T')[0])[0]

    const deleteEvent = async () => {
        try {
            setLoading(true)
            const respDeleteEvent = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/events/${eventDetails?._id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (!respDeleteEvent.ok) throw new Error('Error eliminando cita')

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

    const updatePatientStatus = async (data: any) => {
        try {
            setLoading(true)
            let respPatients = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/patient/${data._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: data._id,
                    isActive: data.isActive
                })
            })

            if (respPatients.ok) {
                let patientResp = await respPatients.json()
                console.log(patientResp)
                await refetchEvents()
                // setOpen(false)
                setLoading(false)
                enqueueSnackbar(`Paciente ${data.isActive ? 'activado' : 'desactivado'} exitosamente!`, {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    autoHideDuration: 5000,
                    key: 'error-delete-event'
                })
                return
            } else {
                setLoading(false)
                enqueueSnackbar('No autorizado', {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    autoHideDuration: 5000,
                    key: 'error-delete-event'
                })
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            enqueueSnackbar('Error actualizando paciente', {
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
    
    useEffect(() => {
        setActivePatient(isPatientActive)
    }, [isPatientActive])
    

    return (
        <>
            <NotificationDialog handleDeleteAction={deleteEvent} />
            <Dialog
                open={open}
                scroll={scroll}
                onClose={() => {
                    setOpen(!open)
                    setEditEvent(false)
                    setCancelEvent(false)
                    setShowMore(false)
                }}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <IconButton
                    aria-label="close"
                    onClick={() => {
                        setOpen(false)
                        setEditEvent(false)
                        setCancelEvent(false)
                        setShowMore(false)
                    }}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                {/* // ! DIALOG HEADER  */}
                <span style={{ cursor: 'move' }} id="draggable-dialog-title" className='flex flex-row items-center justify-center'>
                    <div className='pt-4'>
                        <span>
                            {!editEvent ? eventDetails?.title : null}
                            <span
                                className="ml-2 inline-block rounded-full px-3 text-[10px] font-light text-white mr-2 mb-1"
                                style={{
                                    backgroundColor: EVENTS_TYPE_COLORS[eventDetails?.eventType]
                                }}
                            >
                                {eventDetails?.eventType}
                            </span>
                            <hr className='w-full my-1' />
                            <div className='font-medium text-clip text-center text-sm text-gray-500'>
                                {selectedDate?.date}
                                {"  "}
                                ({moment(eventDetails?.rrule?.dtstart ? eventDetails?.rrule?.dtstart : eventDetails?.start).format('h:mm a')} 
                                {" - "}
                                {moment(eventDetails?.rrule?.until ? eventDetails?.rrule?.until : eventDetails?.end).format('h:mm a')})
                            </div>
                        </span>

                    </div>


                </span>
                    {editEvent && (
                        <div
                            className='flex gap-2 items-center cursor-pointer ml-2'
                            onClick={() => {
                                setCancelEvent(false)
                                setEditEvent(false)
                            }} >
                            <ArrowLeftIcon
                                className="h-6 w-6 text-green-500"
                            />
                            <span
                                className='text-sm font-semibold text-gray-600 cursor-pointer'
                            >
                                Volver
                            </span>
                        </div>
                    )}
                <DialogContent className="sm:min-w-[500px] m-0 px-0" >

                    {/* // ! DETAILS OF THE EVENT  */}
                    {!editEvent && <div className='px-6'>

                        <div className='mb-4 w-[100%] flex'>
                            {canceledReportInSelectedDate?.description?.length && canceledReportInSelectedDate?.isForEventCancel && (
                                <>
                                    <Alert severity="error" className='w-[100%]'>
                                        <div className='w-[100%] flex flex-row justify-around'>
                                            <p>
                                                {canceledReportInSelectedDate?.description}
                                            </p>
                                        </div>
                                    </Alert>
                                </>
                            )}
                        </div>

                        <div className='flex items-center flex-row'>
                            <b className='mr-2'>Paciente: </b>
                            {eventDetails?.patient?.canTakePhoto ? (
                                <Tooltip title="Se le puede tomar foto">
                                    <CameraIcon
                                        className="h-4 w-4 mx-2 text-green-500"
                                    />
                                </Tooltip>
                            ) : (
                                <Tooltip title="No se le puede tomar foto">
                                    <CameraIcon
                                        className="h-5 w-5 mx-2 text-red-500"
                                    />
                                </Tooltip>
                            )}

                            {(activePatient && userInfo[0]?.role === 'admin') ? (
                                <Tooltip title="Paciente activado">
                                    <StarIcon
                                        onClick={() => {
                                            setActivePatient(false)
                                            updatePatientStatus({ _id: eventDetails?.patient?._id, isActive: false })
                                        }}
                                        className="h-5 w-5 mx-2 text-yellow-500"
                                    />
                                </Tooltip>
                            ) : (
                                <Tooltip title="Paciente desactivado">
                                    <StarBorderIcon
                                        onClick={() =>{
                                             setActivePatient(true)
                                             updatePatientStatus({ _id: eventDetails?.patient?._id, isActive: true })
                                        }}
                                        className="h-5 w-5 mx-2"
                                    />
                                </Tooltip>
                            )}

                            <p
                                className='font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer'
                                onClick={() => {
                                    if (!eventDetails?.patient.reports.length) return
                                    router.push(`/dashboard/patientHistory/${eventDetails?.patient?._id}`, { scroll: false })
                                }}
                            >
                                {eventDetails?.patient.name + ' ' + eventDetails?.patient?.lastname}
                            </p>
                        </div>

                        <div className='flex flex-col sm:flex-row mt-1'>
                            <b className='mr-2'>Fecha de Nacimiento: </b> <p className='mr-2'>{moment(eventDetails?.patient?.dateOfBirth).format('DD/MM/YYYY')}</p>
                            <p className='text-sm'>
                                {
                                    // calculate age if the patient doents have more than 1 year
                                    calculateAgeWithMonths(eventDetails?.patient?.dateOfBirth)?.years === 0 ?
                                        `(${calculateAge(new Date(eventDetails?.patient?.dateOfBirth))} meses) `
                                        :
                                        `(${calculateAgeWithMonths(eventDetails?.patient?.dateOfBirth)?.years} años y ${calculateAgeWithMonths(eventDetails?.patient?.dateOfBirth)?.months} meses)`
                                }
                            </p>
                        </div>

                        <div className='flex flex-col sm:flex-row mt-1'>
                            <b className='mr-2'>Diagnóstico: </b> <p>{eventDetails?.patient?.diagnosis}</p>
                        </div>

                        <div className='flex flex-col sm:flex-row mt-1 mb-4'>
                            <b className='mr-2'>MC: </b>
                            <p>

                                {!showMore && eventDetails?.patient?.historyDescription.substring(0, 50)}
                                {showMore && eventDetails?.patient?.historyDescription}

                                {eventDetails?.patient?.historyDescription.length < 53 ? null :
                                    <a
                                        className='font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer'
                                        onClick={() => setShowMore(!showMore)}>
                                        {!showMore ? '...Ver más' : 'Ver menos'}
                                    </a>
                                }

                            </p>
                        </div>

                        <hr />

                        <div className='flex flex-col sm:flex-row mt-4'>
                            <b className='mr-2'>Especialista asignado: </b> <p>{eventDetails?._asignTo.name}</p>
                        </div>

                        <div className='flex flex-col mb-4'>
                            <b className='my-2'>Especialistas asignados: </b>

                            <div className='flex flex-row gap-5'>
                                {selectedDate?.patient?.specialistAssigned?.map((specialist: any) => {

                                    let eventsBySpecialist = specialist.events.map((event: any) => {

                                        const fechaActual = new Date();

                                        const tiempoFechaAComparar = new Date(event.end).getTime();
                                        const tiempoFechaActual = fechaActual.getTime();

                                        // si la fecha final es menor a hoy, entonces es una sesion que ya terminó
                                        if (tiempoFechaAComparar < tiempoFechaActual) return
                                        return event
                                    }).filter(Boolean).map((event: any) => (event.byweekday.length > 0) && event).filter((event: any) => (event.patient === patientID && event.eventType === 'SESION'))

                                    return (
                                        <div className='flex flex-col items-center justify-center gap-1' key={specialist._id}>
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
                                                className="font-semibold text-clip text-sm text-center text-gray-600"
                                            >
                                                {specialist.name}
                                            </p>

                                            {eventsBySpecialist.map((event: any, i: any) => {
                                                return (
                                                    <div key={i} className='flex flex-col items-center hover:bg-[#efefef] p-2 rounded-sm'>
                                                        <p
                                                            color="blue-gray"
                                                            className="font-medium text-clip text-center text-sm text-gray-500 max-w-[120px]"
                                                        >
                                                            {event.byweekday.map((day: any) => {

                                                                const isLast = event.byweekday.findIndex((ele: any) => ele === day) === event.byweekday.length - 1;

                                                                return (`${weekDays[day]} ${!isLast ? '-' : ''} `)
                                                            })}
                                                        </p>

                                                        <p
                                                            color="blue-gray"
                                                            className="font-light text-clip text-center text-sm text-gray-500"
                                                        >

                                                            ({moment(new Date(event?.start)).format('h:mm a')} -
                                                            {moment(new Date(event?.end)).format('h:mm a')})
                                                        </p>

                                                        {/* TODO: AQUI COLOCAR LA FECHA DE LA ENNTREVISTA - EVAL  */}

                                                        {/* <span className='text-xs text-gray-500'>
                                                            ({moment(event.start).format('DD/MM/YYYY')}
                                                        </span>
                                                        <span className='text-xs text-gray-500'>
                                                            {moment(event.end).format('DD/MM/YYYY')})
                                                        </span> */}

                                                    </div>
                                                )
                                            })}
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
                    </div>}

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
                isForEventCancel: true,
                hasRecovery: true
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
                enqueueSnackbar('Evento cancelado exitosamente', {
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
            enqueueSnackbar('Error cancelando evento', {
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
            <form onSubmit={handleSubmit(handleClick)} className='px-6'>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col justify-start items-center gap-4">
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
                        {isAddingReport ? "Guardando..." : "Cancelar evento"}
                    </button>
                </DialogFooter>
            </form>
        </div>
    )
}

export default EventDetailsModal