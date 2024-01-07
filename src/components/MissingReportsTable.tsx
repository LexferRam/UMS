import React from 'react'
import { 
    CheckIcon, 
    PencilSquareIcon, 
    XMarkIcon 
} from '@heroicons/react/24/outline';
import moment from 'moment';
import 'moment/locale/es'
moment.locale('es');

const MissingReportsTable: React.FC<{
    tableHeaders: string[],
    missingReportsWithDate: any
}> = ({
    tableHeaders,
    missingReportsWithDate
}) => {
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
                            {missingReportsWithDate?.map(({ userEventId, userEventTitle, date, hasReport, _asignTo,  patient}: any, index: any) => {
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
                                            <p
                                                color="blue-gray"
                                                className="font-normal max-w-sm"
                                            >
                                                {_asignTo}
                                            </p>
                                        </td>
                                        <td className={classes}>
                                            <p
                                                color="blue-gray"
                                                className="font-normal max-w-sm"
                                            >
                                                {patient}
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
                                        <td className={classes}>
                                            <p
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {hasReport ?
                                                    <CheckIcon className="h-6 w-6 text-green-500" /> :
                                                    <XMarkIcon className="h-6 w-6 text-red-500" />
                                                }
                                            </p>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex gap-2 items-center cursor-pointer">
                                                <PencilSquareIcon className="h-7 w-7 text-green-500" />
                                                <p>Agregar Reporte</p>
                                            </div>
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