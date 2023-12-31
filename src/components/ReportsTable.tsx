'use client'

import { FC } from "react";
import moment from "moment";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

const ReportsTable: FC<{ tableHeaders: string[], events: any }> = ({ tableHeaders, events }) => {

    return (
        <div className='p-5 max-h-[700px] overflow-scroll'>
            <h3 className='font-semibold text-gray-600 text-xl'>Mis reportes:</h3>
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
                        {events?.map(({ _id, description,createdAt,associatedEvent }: any, index: any) => {
                            const isLast = index === events.length - 1;
                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={_id}>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal max-w-sm"
                                        >
                                            {description}
                                        </p>
                                    </td>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {moment(createdAt).format('LLL')}
                                        </p>
                                    </td>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {associatedEvent}
                                        </p>
                                    </td>
                                    <td className={classes}>
                                        <PencilSquareIcon className="h-7 w-7 text-green-500" />
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

export default ReportsTable