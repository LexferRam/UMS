import { FC } from "react";
import moment from "moment";
import 'moment/locale/es'
import Image from "next/image";
import MaterialTable, { Column } from "@material-table/core";
import { localizationTableConfig, tableOptionConfig } from "@/util/tablesConfig";
import NoDataToShow from "../NoDataToShow";
import { useRouter } from "next/navigation";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EventTypeChip from "../EventTypeChip";
import { isToday } from "@/util/dates";
import { Tooltip } from "@mui/material";
moment.locale('es');

const EventsTable: FC<{ events: any, userRole: any }> = ({ events, userRole }) => {
    const router = useRouter()

    function hasObjectWithTodaysDate(reports: any) {
        const today = new Date().toLocaleString("es-VE").split(',')[0];

        return reports.some((dateObj: any) => {
            let dateStr = new Date(dateObj.createdAt).toLocaleString("es-VE").split(',')[0];
            if (!dateStr) return false; // Skip if "date" property is missing
            return (today === dateStr);
        });

    }

    const columnsAdmin: Array<Column<any>> = [
        {
            title: "Evento",
            field: "title",
            render: rowData => {

                let cancelReport = rowData?.reports.filter((report: any) => isToday(report?.createdAt) && report?.isForEventCancel)

                return (
                    <div className="flex flex-col items-center">
                        <EventTypeChip eventType={rowData?.eventType} />
                        {cancelReport.length ? (
                            <Tooltip title={cancelReport[0]?.description}>
                                <span
                                    className="ml-2 inline-block rounded-full px-3 py-1 text-[10px] font-light text-white mr-2 mb-2"
                                    style={{
                                        backgroundColor: '#e64451'
                                    }}
                                >
                                    Cita cancelada
                                </span>
                            </Tooltip>
                        ) : null}
                        <p className="text-center">
                            {rowData.title}
                        </p>
                    </div>
                )
            },
        },
        {
            title: "Hora",
            field: "start",
            render: rowData => (
                <p
                    color="blue-gray"
                    className="font-normal max-w-sm"
                >
                    {moment(rowData.start).format('h:mm a')}
                </p>
            )
        },
        {
            title: "Nombre del paciente",
            field: "name",
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
            title: "Especialista",
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
        }, {
            title: "Reporte",
            field: "",
            render: rowData => (
                <div className="flex flex-col items-center gap-2">
                    {
                        hasObjectWithTodaysDate(rowData.reports) ?
                            <div className="flex items-center gap-2">
                                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                <span>Reporte Cargado</span>
                            </div> :
                            <div className="flex items-center gap-2">
                                <CancelIcon className="h-6 w-6 text-red-500" />
                                <span>Sin Reporte</span>
                            </div>
                    }
                </div>
            ),
            headerStyle: {
                textAlign: 'end'
            }
        }
    ]

    const columnsSpecialist: Array<Column<any>> = [
        {
            title: "Evento",
            field: "title",
            render: rowData => (
                <div>
                    <EventTypeChip eventType={rowData?.eventType} /> <br />
                    {rowData.title}
                </div>
            )
        },
        {
            title: "Hora",
            field: "start",
            render: rowData => (
                <p
                    color="blue-gray"
                    className="font-normal max-w-sm"
                >
                    {moment(rowData.start).format('h:mm a')}
                </p>
            )
        },
        {
            title: "Nombre del paciente",
            field: "name",
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
        }
    ]

    if (!events?.length) return <NoDataToShow />

    return (
        <div className='p-5'>
            <h3 className='font-semibold text-gray-600 text-xl w-full'> Citas para hoy:</h3>
            <div className="h-full w-full overflow-scroll shadow-md rounded mt-8 scrollbar-hide">
                <MaterialTable
                    columns={userRole === 'admin' ? columnsAdmin : columnsSpecialist}
                    data={events}
                    localization={localizationTableConfig}
                    options={tableOptionConfig}
                />
            </div>
        </div>
    )
}

export default EventsTable