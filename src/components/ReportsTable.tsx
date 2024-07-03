'use client'

import { FC, useState } from "react";
import moment from "moment";
import 'moment/locale/es'
import Image from "next/image";
import NoDataToShow from "./NoDataToShow";
import MaterialTable, { Column } from "@material-table/core";
import { IRecoverEvents } from "@/interfaces/recoverEvents";
import { localizationTableConfig, tableOptionConfig } from "@/util/tablesConfig";
import { AddEventModal } from "@/app/dashboard/scheduler/_components/AddEventModal";
moment.locale('es');

const ReportsTable: FC<{ reports: IRecoverEvents[] }> = ({ reports }) => {
    const [openModal, setOpenModal] = useState(false)

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
                    <>
                        {`${rowData.associatedEvent.patient.name} ${rowData.associatedEvent.patient.lastname}`}
                    </>
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
                
                console.log(rowData)

                return (
                    <AddEventModal
                        open={openModal}
                        setOpen={setOpenModal}
                        onEventAdded={(e: any) => { }} //onEventAdded(e)
                        recoverEvent
                        rowData={rowData}
                    />
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

// las sesiones de recuracion pueden ser 1 ,2 o 3, y en total deben sumar un total de 45min
// si no suman 45min en total la cita cancelada debe seguir apareciendo com faltante por recupracion