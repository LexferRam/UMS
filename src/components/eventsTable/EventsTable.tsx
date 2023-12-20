'use client'

import { FC } from "react";
import { AddReportModal } from "../addReportModal/AddReportModal";

const EventsTable: FC<{ tableHeaders: string[], events: any }> = ({ tableHeaders, events }) => {


    return (
        <div className='p-5 max-h-[700px] overflow-scroll'>
            <h3>Mis citas para hoy:</h3>
            <div className="h-full w-full overflow-scroll">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {tableHeaders.map((head) => (
                                <th
                                    key={head}
                                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
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
                        {events?.map(({ title, patient, _id, lastname }: any) => ({ name: title, job: patient, date: _id, lastname }))?.map(({ name, job, date, lastname }: any, index: any) => {
                            const isLast = index === events.length - 1;
                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={date}>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {name}
                                        </p>
                                    </td>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            <b>id paciente:</b> {job}
                                        </p>
                                    </td>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            <b>id evento:</b> {date}
                                        </p>
                                    </td>
                                    <td className={classes}>
                                        <AddReportModal />
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