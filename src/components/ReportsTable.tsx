'use client'

import { FC } from "react";
import moment from "moment";
import 'moment/locale/es'
import Image from "next/image";
moment.locale('es');

const ReportsTable: FC<{ tableHeaders: string[], reports: any }> = ({ tableHeaders, reports }) => {

    if (!reports.length) return (
        <div className='w-full h-full flex items-center justify-center mt-16'>
            <Image
                src='/nodata.png'
                alt='logo_login'
                width={150}
                height={150}
                priority
            />
            <p className='text-sm font-semibold text-gray-600'>Sin datos que mostrar</p>
        </div>
    )

    return (
        <div className='p-5 max-h-[700px] overflow-scroll'>
            <h3 className='font-semibold text-gray-600 text-xl'>Reportes:</h3>
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
                        {reports?.map(({ _id, createdBy, createdAt, description, associatedEvent }: any, index: any) => {
                            const isLast = index === reports.length - 1;
                            const classes = isLast ? "p-4 " : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={_id} className="hover:bg-[#f8fafc]">
                                    <td className={classes}>
                                        <div className="flex flex-col items-center gap-2">
                                            <Image
                                                src={createdBy.lastname}
                                                className="rounded-full"
                                                alt='logo_login'
                                                width={40}
                                                height={40}
                                                priority
                                            />
                                            <p
                                                color="blue-gray"
                                                className="font-normal text-clip text-gray-500"
                                            >
                                                {createdBy.name}
                                            </p>
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {/* {moment(createdAt).format('LL')} */}
                                            {createdAt}
                                        </p>
                                    </td>
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
                                            {associatedEvent.title}
                                        </p>
                                    </td>

                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {associatedEvent.patient?.name + ' ' + associatedEvent.patient?.lastname}
                                        </p>
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