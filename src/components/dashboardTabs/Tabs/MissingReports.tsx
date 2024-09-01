import React, { FC } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const MissingReports: FC<{
    setSelectedCard: any,
    tableContainerRef: any,
    missingReportsWithDate: any
}> = ({
    setSelectedCard,
    tableContainerRef,
    missingReportsWithDate
}) => {
        return (
            <div
                onClick={() => {
                    setSelectedCard('missingReports')
                    tableContainerRef.current.scrollIntoView({ behavior: 'smooth' })
                }}
                className="relative overflow-hidden p-5 bg-orange-50 rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer"
            >
                <div className="flex items-center space-x-2 space-y-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 min-h-[90px]">
                        <ExclamationTriangleIcon className="h-9 w-9 text-orange-400" strokeWidth={2} />
                    </div>
                    <div className='flex flex-col items-center'>
                        <div className="text-orange-800 text-center font-semibold">Reportes faltantes</div>
                        <div className="text-2xl font-bold text-orange-900">{missingReportsWithDate?.length}</div>
                    </div>
                    <div>
                        <div className='absolute -top-1/4 -right-12 w-[100px] h-[100px] bg-orange-200 rounded-full opacity-40' />
                        <div className='absolute -bottom-1/4 -right-16 w-[100px] h-[100px] bg-orange-200 rounded-full opacity-40' />
                        <div className='absolute -bottom-1/4 -left-16 w-[100px] h-[100px] bg-orange-200 rounded-full opacity-40' />
                        <div className='absolute -top-1/4 -left-16 w-[100px] h-[100px] bg-orange-200 rounded-full opacity-40' />
                    </div>
                </div>



            </div>
        )
    }

export default MissingReports