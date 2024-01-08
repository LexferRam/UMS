import React from 'react'
import { 
    CheckIcon, 
    PencilSquareIcon, 
    XMarkIcon 
} from '@heroicons/react/24/outline';
import moment from 'moment';
import 'moment/locale/es'
import { AddReportModal } from './addReportModal/AddReportModal';
import Image from 'next/image';
moment.locale('es');

const MissingReportsTable: React.FC<{
    tableHeaders: string[],
    missingReportsWithDate: any,
    refecthFns?:any
}> = ({
    tableHeaders,
    missingReportsWithDate,
    refecthFns
}) => {

    if (!missingReportsWithDate?.length) return (
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
                <h3 className='font-semibold text-gray-600 text-xl'>Reportes faltantes:</h3>
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
                            {missingReportsWithDate?.map(({ 
                                userEventId, 
                                userEventTitle, 
                                date, 
                                hasReport, 
                                _asignTo,  
                                patient,
                            }: any, index: any) => {
                                const isLast = index === missingReportsWithDate.length - 1;
                                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                return (
                                    <tr key={userEventId} className="hover:bg-[#f8fafc]">
                                        <td className={classes}>
                                            <p
                                                color="blue-gray"
                                                className="font-normal max-w-sm"
                                            >
                                                {userEventTitle}
                                            </p>
                                        </td>
                                        <td className={classes}>
                                            {/* <p
                                                color="blue-gray"
                                                className="font-normal max-w-sm"
                                            >
                                                {_asignTo}
                                            </p> */}
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
                                            <p
                                                color="blue-gray"
                                                className="font-normal max-w-sm"
                                            >
                                                {patient?.name}
                                            </p>
                                        </td>
                                        <td className={classes}>
                                            <p
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {moment(date).format('LL')}
                                            </p>
                                        </td>
                                        {/* <td className={classes}>
                                            <p
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {hasReport ?
                                                    <CheckIcon className="h-6 w-6 text-green-500" /> :
                                                    <XMarkIcon className="h-6 w-6 text-red-500" />
                                                }
                                            </p>
                                        </td> */}
                                        <td className={classes}>
                                            <AddReportModal
                                                eventId={userEventId} 
                                                patient={patient} 
                                                dateOfMissingReport={date}
                                                refecthFns={refecthFns}
                                            />
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

export default MissingReportsTable