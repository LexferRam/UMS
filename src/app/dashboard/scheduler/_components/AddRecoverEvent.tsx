'use client'

import { useContext, useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-dropdown-menu"
import { useForm } from "react-hook-form"
import moment from "moment"
import { LoadingContext } from "@/context/LoadingProvider"
import { enqueueSnackbar } from "notistack"
import { Alert, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material"
import { DevTool } from "@hookform/devtools"

export default function AddRecoverEvent({ open, setOpen, recoverEvent, rowData, refecthFns }: any) {

    const { setLoading } = useContext(LoadingContext) as any
    const [eventsQuatity, setEventsQuatity] = useState(Array.from({ length: 1 }))
    const [value, setValues] = useState<String>('1')

    const { register, handleSubmit, formState: { errors }, reset, setValue, control } = useForm()

    const onSubmit = async (data: any) => {

        if (recoverEvent) {
            setLoading(true)

            try {
                var recoverEventBody = {
                    _creator: rowData.createdBy._id,                                                       // _id del creador del evento
                    _asignTo: rowData.associatedEvent._asignTo._id,                                        // ObjectID del especialista asignado a la cita
                    title: data.title,                                                                     // titulo evento de recupracion
                    start: new Date(data.eventDate + 'T' + data.timeStart + ':' + '00').toISOString(),     // fecha de inicio del evento, UTC format: 2024-06-24T11:00:00.000+00:00
                    end: new Date(data.eventDate + 'T' + data.timeEnd + ':' + '00').toISOString(),         // fecha de culminacion del evento, UTC format: 2024-06-24T11:00:00.000+00:00
                    patient: rowData.associatedEvent.patient._id,                                          // ObjectID del paciente asignado a la cita
                    eventType: 'RECUPERACION',                                                             // tipo de evento: RECUPERACION
                    freq: 'daily',                                                                         // frecuencia del evento
                    byweekday: [],                                                                         // dias de frecuencia 
                    reports: [],                                                                           // reportes del evento
                    recoverEvent: true,                                                                     // booleano que indica si es un evento de recuperacion
                    reportOfCancelEventID: rowData._id                                                     // ID de un reporte de un evento cancelado
                }


                let resEvent1 = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(recoverEventBody)
                })

                if (data?.eventDate_1) {
                    let resEvent2 = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            ...recoverEventBody,
                            title: `2DA ${data.title}`,
                            start: new Date(data.eventDate_1 + 'T' + data.timeStart_1 + ':' + '00').toISOString(),
                            end: new Date(data.eventDate_1 + 'T' + data.timeEnd_1 + ':' + '00').toISOString(),
                        })
                    })
                }

                if (data?.eventDate_2) {
                    let resEvent3 = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            ...recoverEventBody,
                            title: `3RA ${data.title}`,
                            start: new Date(data.eventDate_2 + 'T' + data.timeStart_2 + ':' + '00').toISOString(),
                            end: new Date(data.eventDate_2 + 'T' + data.timeEnd_2 + ':' + '00').toISOString(),
                        })
                    })
                }


                // if (resEvent1.ok || resEvent2.ok || resEvent3.ok ) {
                if (resEvent1.ok) {
                    setOpen(false)
                    await refecthFns.refetchReports()
                    await refecthFns.refetchUserEvent()
                    reset()

                    setLoading(false)
                    enqueueSnackbar('Cita de recuperación creada exitosamente!', {
                        variant: 'success',
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        autoHideDuration: 5000,
                        key: 'error-delete-event'
                    })

                    return resEvent1
                }
            } catch (error) {
                console.log(error)
                setLoading(false)
                enqueueSnackbar('Error creando cita de recuperación', {
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
    }

    useEffect(() => {
        if (recoverEvent) {
            setValue('title', `RECUPERACIÓN: ${rowData?.associatedEvent?.patient?.name} (${moment(rowData?.createdAt).format('L')})`)
            setValues('1')
            setEventsQuatity(Array.from({ length: 1 }))
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            {/* className="sm:max-w-[425px]" */}
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>Nuevo Evento</DialogTitle>
                </DialogHeader>

                <Alert severity="warning" className='w-[100%]'>
                    Las sesiones de recuperación pueden ser 1, 2 o 3 y en total deben sumar 45 minutos.
                </Alert>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 pb-4">

                        <div className="flex flex-col gap-4">
                            <div className="w-full flex flex-col gap-2 flex-wrap justify-center items-start">
                                <Label className="text-right">
                                    Título:
                                </Label>
                                <Input
                                    type="text"
                                    defaultValue=""
                                    {...register("title",
                                        {
                                            required: 'Ingrese el título',
                                            shouldUnregister: true,
                                            min: { value: 4, message: "La longitud minima es de 4 caracteres" }
                                        })}
                                />
                                {errors.title && <p className="text-red-700">{JSON.stringify(errors?.title?.message)}</p>}
                            </div>
                        </div>

                        <FormControl>
                            <FormLabel id="demo-controlled-radio-buttons-group">Seleccione cantidad de citas de recuperación:</FormLabel>
                            <RadioGroup
                                value={value}
                                onChange={(e) => {
                                    setValues(e.target.value)
                                    setEventsQuatity(Array.from({ length: Number(e.target.value) }))
                                }}
                            >
                                <div style={{ display: 'flex' }}>
                                    <FormControlLabel value="1" control={<Radio />} label="1 cita" />
                                    <FormControlLabel value="2" control={<Radio />} label="2 citas" />
                                    <FormControlLabel value="3" control={<Radio />} label="3 citas" />
                                </div>
                            </RadioGroup>
                        </FormControl>

                        {/* BLOQUES DE FECHAS DE RECUPERACION */}
                        {eventsQuatity.map((recoveryEvent, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column'}}>
                                <h3 style={{fontWeight: 'bold', marginBottom: '3px'}}>Bloque {i+1}:</h3>
                                <div className="flex gap-4">
                                    <div className=" w-full flex flex-col gap-2 flex-wrap justify-center items-start">
                                        <Label className="text-right">
                                            Fecha Inicio:
                                        </Label>
                                        <input
                                            type="date"
                                            {...register(i > 0 ? `eventDate_${i}` : "eventDate",
                                                {
                                                    required: 'Ingrese la fecha del evento',
                                                    shouldUnregister: true,
                                                    min: { value: 4, message: "The min length is 4 characters" }
                                                })}
                                            className="w-full"
                                        />
                                        {(i > 0 ? errors[`eventDate_${i}`] : errors["eventDate"]) && <p className="text-red-700">{JSON.stringify(i > 0 ? errors[`eventDate_${i}`]?.message : errors["eventDate"]?.message)}</p>}
                                    </div>
                                    <div className="w-full flex flex-col items-start gap-2">
                                        <Label className="text-right">
                                            Hora inicio:
                                        </Label>
                                        <input
                                            type="time"
                                            {...register(i > 0 ? `timeStart_${i}` : "timeStart",
                                                {
                                                    required: 'Ingrese la hora de inicio',
                                                    shouldUnregister: true,
                                                })}
                                            className="w-full"
                                        />
                                        {(i > 0 ? errors[`timeStart_${i}`] : errors["timeStart"]) && <p className="text-red-700">{JSON.stringify(i > 0 ? errors[`timeStart_${i}`]?.message : errors["timeStart"]?.message)}</p>}
                                    </div>

                                    <div className="w-full flex flex-col items-start gap-2">
                                        <Label className="text-right">
                                            Hora final:
                                        </Label>
                                        <input
                                            type="time"
                                            {...register(i > 0 ? `timeEnd_${i}` : "timeEnd", 
                                                {
                                                    required: 'Ingrese la hora de culminación',
                                                    shouldUnregister: true,
                                                })}
                                            className="w-full"
                                        />
                                        {(i > 0 ? errors[`timeEnd_${i}`] : errors["timeEnd"]) && <p className="text-red-700">{JSON.stringify(i > 0 ? errors[`timeEnd_${i}`]?.message : errors["timeEnd"]?.message)}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>

                    <DialogFooter>
                        <button
                            className=" w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ffc260] hover:bg-[#f8b84e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f8fafc]"
                            type="submit"
                        >
                            Guardar
                        </button>
                    </DialogFooter>
                    <DevTool control={control} />
                </form>

            </DialogContent>
        </Dialog>
    )
}
