import React, { useState } from 'react'
import moment from 'moment';
import 'moment/locale/es'
import { AddReportModal } from './addReportModal/AddReportModal';
import Image from 'next/image';
import NoDataToShow from './NoDataToShow';
import MaterialTable, { Column } from '@material-table/core';
import { localizationTableConfig, tableOptionConfig } from '@/util/tablesConfig';
import { useRouter } from 'next/navigation';
import EventTypeChip from './EventTypeChip';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
moment.locale('es');

const MissingReportsTable: React.FC<{
    missingReportsWithDate: any,
    refecthFns?: any
}> = ({
    missingReportsWithDate,
    refecthFns
}) => {

    const router = useRouter()
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [currentRowData, setCurrentRowData] = useState<{
        eventId: string,
        patient: any,
        dateOfMissingReport: string
    }>()
    const columns: Array<Column<any>> = [
        {
            title: "Evento cancelado",
            field: "userEventTitle",
            render: rowData => {
                return (
                    <>
                        <EventTypeChip eventType={rowData?.eventType} /> <br />
                        {rowData.userEventTitle}
                    </>
                )
            }
        },
        {
            title: "Especialista asignado",
            field: "_asignTo.name",
            render: rowData => (
                <div className="flex flex-col items-center gap-2">
                    <Image
                        src={rowData._asignTo.lastname}
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
                        {rowData._asignTo.name}
                    </p>
                </div>
            ),
            headerStyle: {
                alignItems: 'center'
            }
        },
        {
            title: "Paciente",
            field: "_asignTo.name",
            render: rowData => (
                <p
                    className='font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer'
                    color="blue-gray"
                    onClick={() => {
                        if (!rowData.patient) return
                        router.push(`/dashboard/patientHistory/${rowData.patient?._id}`, { scroll: false })
                    }}
                >
                    {`${rowData.patient.name} ${rowData.patient.lastname}`}
                </p>
            )
        },
        {
            title: "Fecha del reporte faltante",
            field: "date",
            render: rowData => (
                <p
                    color="blue-gray"
                    className="font-normal max-w-sm"
                >
                    {rowData.date}
                </p>
            )
        },
        {
            title: "Agregar reporte",
            field: "_asignTo.name",
            render: (rowData: any) => {

                return (
                    <Button
                        onClick={() => {
                            setCurrentRowData({
                                eventId: rowData.userEventId,
                                patient: rowData.patient,
                                dateOfMissingReport: rowData.date
                            });
                            setOpenModal(true)
                        }}
                        style={{
                            textTransform: 'capitalize'
                        }}
                        startIcon={<AddIcon />}
                    >
                        Agregar reporte
                    </Button>
                )
            }
        },
    ]

        if (!missingReportsWithDate?.length) return <NoDataToShow />

        return (
            <div className='p-5'>
                <AddReportModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    currentRowData={currentRowData}
                    refecthFns={refecthFns}
                />
                <h3 className='font-semibold text-gray-600 text-xl w-full'>Reportes faltantes:</h3>
                <div className="h-full w-full overflow-scroll shadow-md rounded mt-8 scrollbar-hide">
                    <MaterialTable
                        columns={columns}
                        data={missingReportsWithDate}
                        localization={localizationTableConfig}
                        options={tableOptionConfig}
                    />
                </div>

            </div>
        )
    }

export default MissingReportsTable