'use client'

import { FC } from "react";
import { AddReportModal } from "../addReportModal/AddReportModal";
import moment from "moment";

const EventsTable: FC<{ tableHeaders: string[], events: any }> = ({ tableHeaders, events }) => {

    return (
        <div className='p-5 max-h-[700px] overflow-scroll'>
            <h3 className='font-semibold text-gray-600 text-xl'>Mis citas para hoy:</h3>
            <div className="h-full w-full overflow-scroll shadow-md rounded p-8">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {tableHeaders.map((head) => (
                                <th
                                    key={head}
                                    className="border-b border-blue-gray-100 bg-[#f8fafc] p-4"
                                >
                                    <p
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {head}
                                    </p>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {events?.map(({ title, patient, _id, eventStatus,start }: any, index: any) => {
                            const isLast = index === events.length - 1;
                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={_id}>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {title}
                                        </p>
                                    </td>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {eventStatus ? (
                                                <span className="inline-block bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                                    Activo
                                                </span>
                                            ) : (
                                                <span className="inline-block bg-red-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                                    Desactivo
                                                </span>
                                            )}
                                        </p>
                                    </td>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {moment(start).format('h:mm a')}
                                        </p>
                                    </td>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {patient.name}
                                        </p>
                                    </td>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {patient.isActive ? (
                                                <span className="inline-block bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                                    Activo
                                                </span>
                                            ) : (
                                                <span className="inline-block bg-red-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                                    Desactivo
                                                </span>
                                            )}
                                        </p>
                                    </td>
                                    <td className={classes}>
                                        <AddReportModal eventId={_id} patient={patient} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default EventsTable