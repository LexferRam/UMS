'use client'

import { FC, useState } from "react";
import moment from "moment";
import 'moment/locale/es'
import Image from "next/image";
import NoDataToShow from "./NoDataToShow";
import MaterialTable, { Column } from "@material-table/core";
import { IRecoverEvents } from "@/interfaces/recoverEvents";
import { localizationTableConfig, tableOptionConfig } from "@/util/tablesConfig";
import AddEventModal from "@/app/dashboard/scheduler/_components/AddEventModal";
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

const jsonTest = {
    "_id": "668811a1cf6062ed86942fad",
    "description": "tst cancelando cita",
    "createdBy": {
        "_id": "659ad0edf45365ca087bf71e",
        "email": "lexferramirez@gmail.com",
        "name": "Lexfer Ramirez",
        "lastname": "https://lh3.googleusercontent.com/a/ACg8ocKg1BUVEbF2VPeyPTbGwmieqVG1nWyk5CkCtY4T5-6nw5Q=s96-c",
        "isActive": true,
        "role": "admin",
        "speciality": "TO",
        "events": [
            "665b47e2faacb6941cff890d",
            "6679ba02512b6b119263fe9f",
            "6688118acf6062ed86942fa1"
        ],
        "asignedPatients": [
            "65c2ea83931bc66b8a06d8b7",
            "6675e1bf22dd14abd225f04a"
        ],
        "createdAt": "2024-01-07T16:27:25.010Z",
        "updatedAt": "2024-07-05T15:30:18.970Z",
        "__v": 120,
        "asignColor": "#000000"
    },
    "associatedEvent": {
        "_id": "6688118acf6062ed86942fa1",
        "_creator": "659ad0edf45365ca087bf71e",
        "_asignTo": {
            "_id": "659ad0edf45365ca087bf71e",
            "email": "lexferramirez@gmail.com",
            "name": "Lexfer Ramirez",
            "lastname": "https://lh3.googleusercontent.com/a/ACg8ocKg1BUVEbF2VPeyPTbGwmieqVG1nWyk5CkCtY4T5-6nw5Q=s96-c",
            "isActive": true,
            "role": "admin",
            "speciality": "TO",
            "events": [
                "665b47e2faacb6941cff890d",
                "6679ba02512b6b119263fe9f",
                "6688118acf6062ed86942fa1"
            ],
            "asignedPatients": [
                "65c2ea83931bc66b8a06d8b7",
                "6675e1bf22dd14abd225f04a"
            ],
            "createdAt": "2024-01-07T16:27:25.010Z",
            "updatedAt": "2024-07-05T15:30:18.970Z",
            "__v": 120,
            "asignColor": "#000000"
        },
        "title": "test lexfer",
        "eventStatus": true,
        "start": "2024-06-24T11:00:00.000Z",
        "end": "2024-06-24T12:00:00.000Z",
        "patient": {
            "_id": "65c2ea83931bc66b8a06d8b7",
            "name": "test 2 lexfer",
            "lastname": "test",
            "dateOfBirth": "2023-02-06",
            "diagnosis": "test diag 2",
            "historyDescription": "test consulta",
            "reports": [
                "65d241e26c3a656e4b8de486",
                "65d2b325d820b25109fe7507",
                "65d2ce86d820b25109fe76d4",
            ],
            "isActive": true,
            "createdAt": "2024-02-07T02:27:15.112Z",
            "updatedAt": "2024-07-05T15:30:41.551Z",
            "__v": 51,
            "readySpecialistList": [],
            "desactivatedForSpecialistList": []
        },
        "reports": [
            "668811a1cf6062ed86942fad"
        ],
        "eventType": "ENTREVISTA",
        "freq": "daily",
        "byweekday": [],
        "__v": 1
    },
    "createdAt": "2024-06-24T04:00:00.000Z",
    "isForEventCancel": true,
    "hasRecovery": true,
    "updatedAt": "2024-06-24T04:00:00.000Z",
    "__v": 0,
    "tableData": {
        "index": 0,
        "id": 0,
        "uuid": "34a627a3-861b-402f-8435-849a38ad780f"
    }
}