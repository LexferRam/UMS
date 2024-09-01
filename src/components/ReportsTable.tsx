'use client'

import React, { FC, useCallback, useContext, useState } from "react";
import moment from "moment";
import 'moment/locale/es'
import Image from "next/image";
import NoDataToShow from "./NoDataToShow";
import MaterialTable, { Column } from "@material-table/core";
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import { IRecoverEvents } from "@/interfaces/recoverEvents";
import { localizationTableConfig, tableOptionConfig } from "@/util/tablesConfig";
import { useRouter } from "next/navigation";
import { Button, IconButton, Tooltip } from "@mui/material";
import { LoadingContext } from "@/context/LoadingProvider";
import { enqueueSnackbar } from "notistack";
import AddRecoverEvent from "@/app/dashboard/scheduler/_components/AddRecoverEvent";
import EventIcon from '@mui/icons-material/Event';
import EventTypeChip from "./EventTypeChip";
moment.locale('es');

const ReportsTable: FC<{ reports: IRecoverEvents[], refecthFns: any, userRole: string }> = ({ reports, refecthFns, userRole }) => {
    const [openModal, setOpenModal] = useState<Boolean>(false)
    const [currentRowData, setCurrentRowData] = useState()
    const router = useRouter()

    const { setLoading } = useContext(LoadingContext) as any

    const MyTooltipComponent = React.forwardRef(function MyComponent(props: any, ref) {
        //  Spread the props to the underlying DOM element.
        return (
          <div {...props} ref={ref}>
            {props.title.substring(0, 50)}{props.title.length > 30 && '...'}
          </div>
        );
      });

    const columnsAdmin: Array<Column<IRecoverEvents>> = [
        {
            title: "Título del evento cancelado",
            field: "associatedEvent.title",
            render: rowData => (
                <div>
                    <EventTypeChip eventType={rowData.associatedEvent?.eventType} /><br />
                    {rowData.associatedEvent.title} 
                </div>
            )
        },
        {
            title: "Fecha del evento cancelado",
            field: "createdAt",
            render: rowData => (
                <div>
                    <b>{moment(rowData.createdAt).format('dddd')}</b> ({moment(rowData.createdAt).format('L')})
                </div>
            )
        },
        {
            title: "Especialista tratante",
            field: "associatedEvent._asignTo.name",
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
            field: "associatedEvent.patient.name",
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
            field: "description",
            render: rowData => {
                return (
                    <Tooltip title={rowData.description}>
                        <MyTooltipComponent title={rowData.description} />
                    </Tooltip>
                )
            }
        },
        {
            title: "Crear evento de recuperación",
            field: "actions",
            render: (rowData: any) => {
                return (
                    <Button
                        onClick={() => {
                            setCurrentRowData(rowData);
                            setOpenModal(true)
                        }}
                        style={{
                            textTransform: 'capitalize'
                        }}
                        startIcon={<EventIcon />}
                    >
                        Agregar Evento
                    </Button>
                )
            }
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

    const columns: Array<Column<IRecoverEvents>> = [
        {
            title: "Título del evento cancelado",
            field: "associatedEvent.title",
            render: rowData => (
                <div>
                    <EventTypeChip eventType={rowData.associatedEvent?.eventType} /><br />
                    {rowData.associatedEvent.title}
                </div>
            )
        },
        {
            title: "Fecha del evento cancelado",
            field: "createdAt",
            render: rowData => (
                <div>
                    <b>{moment(rowData.createdAt).format('dddd')}</b> ({moment(rowData.createdAt).format('L')})
                </div>
            )
        },
        {
            title: "Especialista tratante",
            field: "associatedEvent._asignTo.name",
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
            field: "associatedEvent.patient.name",
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
            field: "description",
            render: rowData => {
                return (
                    <Tooltip title={rowData.description}>
                        <MyTooltipComponent title={rowData.description} />
                    </Tooltip>
                )
            }
        }       
    ];

    if (!reports?.length) return <NoDataToShow />

    return (
        <div className='p-5'>
            <AddRecoverEvent
                open={openModal}
                setOpen={setOpenModal}
                recoverEvent
                rowData={currentRowData}
                refecthFns={refecthFns}
            />
            <h3 className='font-semibold text-gray-600 text-xl w-full'>Citas canceladas sin recuperaciones:</h3>
            <div className="h-full w-full overflow-scroll shadow-md rounded mt-8 scrollbar-hide">
                <MaterialTable
                    columns={userRole === 'admin' ? columnsAdmin : columns}
                    data={reports}
                    localization={localizationTableConfig}
                    options={tableOptionConfig}
                />
            </div>

        </div>
    )
}

export default ReportsTable
