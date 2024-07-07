'use client'

import { FC, useContext, useState } from "react";
import moment from "moment";
import 'moment/locale/es'
import Image from "next/image";
import NoDataToShow from "./NoDataToShow";
import MaterialTable, { Column } from "@material-table/core";
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import { IRecoverEvents } from "@/interfaces/recoverEvents";
import { localizationTableConfig, tableOptionConfig } from "@/util/tablesConfig";
import AddEventModal from "@/app/dashboard/scheduler/_components/AddEventModal";
import { useRouter } from "next/navigation";
import { IconButton } from "@mui/material";
import { LoadingContext } from "@/context/LoadingProvider";
import { enqueueSnackbar } from "notistack";
moment.locale('es');

const ReportsTable: FC<{ reports: IRecoverEvents[], refecthFns: any }> = ({ reports, refecthFns }) => {
    const [openModal, setOpenModal] = useState()
    const router = useRouter()
    const { setLoading } = useContext(LoadingContext) as any

    const columns: Array<Column<IRecoverEvents>> = [
        {
            title: "Evento cancelado",
            field: "title",
            render: rowData => (
                <div>
                    {rowData.associatedEvent.title} <br />
                </div>
            )
        },
        {
            title: "Fecha del evento cancelado",
            field: "dateCancelDate",
            render: rowData => (
                <div>
                    <b>{moment(rowData.createdAt).format('dddd')}</b> ({moment(rowData.createdAt).format('L')})
                </div>
            )
        },
        {
            title: "Especialista tratante",
            field: "specialistName",
            render: rowData => {
                return (
                    <>
                        <div className="flex flex-col items-center gap-2">
                            <Image
                                src={rowData.associatedEvent._asignTo?.lastname}
                                className="rounded-full"
                                alt='logo_login'
                                width={40}
                                height={40}
                                priority
                            />
                            <p
                                color="blue-gray"
                                className="font-normal text-clip text-gray-500 text-center"
                            >
                                {rowData.associatedEvent._asignTo.name}
                            </p>
                        </div>
                    </>
                )
            }
        },
        {
            title: "Paciente",
            field: "patient",
            render: rowData => {
                return (
                    <p
                        className='font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer'
                        onClick={() => {
                            if (!rowData.associatedEvent.patient) return
                            router.push(`/dashboard/patientHistory/${rowData.associatedEvent.patient?._id}`, { scroll: false })
                        }}
                    >
                        {`${rowData.associatedEvent.patient.name} ${rowData.associatedEvent.patient.lastname}`}
                    </p>
                )
            }
        },
        {
            title: "Motivo de cancelación",
            field: "cancelMotive",
            render: rowData => {
                return <>{rowData.description}</>
            }
        },
        {
            title: "Crear evento de recuperación",
            field: "actions",
            render: (rowData) => {
                return (
                    <AddEventModal
                        open={openModal}
                        setOpen={setOpenModal}
                        onEventAdded={(e: any) => { }} //onEventAdded(e)
                        recoverEvent
                        rowData={rowData}
                        refecthFns={refecthFns}
                    />)
            },
        },
        {
            title: "Anular recuperación",
            field: "actions",
            render: (rowData) => {
                return (
                    <div className="flex gap-2 justify-around items-center">
                        <IconButton
                            aria-label="delete" 
                            size="small"
                            onClick={async () => {
                                try {
                                    setLoading(true)
                                    let respReport = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/reports`, {
                                        method: 'PATCH',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ id: rowData._id })
                                    })
                                    if (respReport.ok) {
                                        await refecthFns.refetchReports()
                                        setLoading(false)
                                        enqueueSnackbar('Recuperación anulada!', {
                                            variant: 'success',
                                            anchorOrigin: {
                                                vertical: 'top',
                                                horizontal: 'right',
                                            },
                                            autoHideDuration: 5000,
                                            key: 'error-delete-event'
                                        })
                                        return
                                    }

                                } catch (error) {
                                    setLoading(false)
                                    enqueueSnackbar('Error anulando recuperación', {
                                        variant: 'error',
                                        anchorOrigin: {
                                            vertical: 'top',
                                            horizontal: 'right',
                                        },
                                        autoHideDuration: 5000,
                                        key: 'error-delete-event'
                                    })
                                }
                            }}
                        >
                            <DoDisturbOnIcon fontSize="small" />
                        </IconButton>
                    </div>
                )
            },
        }
    ];

    if (!reports?.length) return <NoDataToShow />

    return (
        <div className='p-5'>
            <h3 className='font-semibold text-gray-600 text-xl w-full'>Citas canceladas sin recuperaciones:</h3>
            <div className="h-full w-full overflow-scroll shadow-md rounded mt-8 scrollbar-hide">
                <MaterialTable
                    columns={columns}
                    data={reports}
                    localization={localizationTableConfig}
                    options={tableOptionConfig}
                />
            </div>

        </div>
    )
}

export default ReportsTable

// ! las sesiones de recuracion pueden ser 1 ,2 o 3, y en total deben sumar un total de 45min
// ! si no suman 45min en total la cita cancelada debe seguir apareciendo com faltante por recupracion
