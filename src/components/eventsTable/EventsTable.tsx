'use client'

import { FC } from "react";
import moment from "moment";
import { useUserInfo } from "@/hooks";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import 'moment/locale/es'
import Image from "next/image";
moment.locale('es');

const EventsTable: FC<{ tableHeaders: string[], events: any, refecthFns?: any }> = ({ tableHeaders, events, refecthFns }) => {

    const [userInfo] = useUserInfo()

    function hasObjectWithTodaysDate(reports: any) {
        const today = new Date().toLocaleString("es-VE").split(',')[0];

        return reports.some((dateObj: any) => {
            let dateStr = new Date(dateObj.createdAt).toLocaleString("es-VE").split(',')[0];
            if (!dateStr) return false; // Skip if "date" property is missing
            return (today === dateStr);
        });

    }

    if (!events?.length) return (
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
            <h3 className='font-semibold text-gray-600 text-xl'> Citas para hoy:</h3>
            <div className="h-full w-full overflow-scroll shadow-md rounded mt-8 scrollbar-hide">
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
                        {events?.map(({ title, patient, _id, eventStatus, start, _asignTo, reports }: any, index: any) => {
                            const isLast = index === events.length - 1;
                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={_id} className="hover:bg-[#f8fafc]">
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
                                            {patient.name +' '+ patient.lastname}
                                        </p>
                                    </td>
                                    {userInfo[0]?.role === 'admin' ? (
                                        <>
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
                                                <div className="flex flex-col items-center gap-2">
                                                    <Image
                                                        src={_asignTo.lastname}
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
                                                        {_asignTo.name}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                {hasObjectWithTodaysDate(reports) ?
                                                    <div className="flex items-center gap-2">
                                                        <CheckIcon className="h-6 w-6 text-green-500" />
                                                        <span>Reporte Cargado</span>
                                                    </div> :
                                                    <div className="flex items-center gap-2">
                                                        <XMarkIcon className="h-6 w-6 text-red-500" />
                                                        <span>Sin Reporte</span>
                                                    </div>
                                                }
                                            </td>
                                        </>
                                    ) : (null)}

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