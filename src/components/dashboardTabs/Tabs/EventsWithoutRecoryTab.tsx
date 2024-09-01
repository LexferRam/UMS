import React, { FC } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const EventsWithoutRecoryTab: FC<{
    setSelectedCard: any,
    tableContainerRef: any,
    userReports: any
}> = ({
    setSelectedCard,
    tableContainerRef,
    userReports
}) => {
        return (
            <div
                onClick={() => {
                    setSelectedCard('cancelEventsWithoutRecovery')
                    tableContainerRef.current.scrollIntoView({ behavior: 'smooth' })
                }}
                className="relative overflow-hidden p-5 bg-red-50 rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer"
            >
                <div className="flex items-center space-x-2 space-y-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 min-h-[90px]">
                        <ExclamationTriangleIcon className="h-9 w-9 text-red-400" strokeWidth={2} />
                    </div>
                    <div className='flex flex-col items-center'>
                        <div className="text-red-800 text-center font-semibold max-w-[150px]">Citas por recuperar</div>
                        <div className="text-2xl font-bold text-red-900">
                            {userReports?.length}
                        </div>
                    </div>
                    <div>
                        <div className='absolute -top-1/4 -right-12 w-[100px] h-[100px] bg-red-200 rounded-full opacity-40' />
                        <div className='absolute -bottom-1/4 -right-16 w-[100px] h-[100px] bg-red-200 rounded-full opacity-40' />
                        <div className='absolute -bottom-1/4 -left-16 w-[100px] h-[100px] bg-red-200 rounded-full opacity-40' />
                        <div className='absolute -top-1/4 -left-16 w-[100px] h-[100px] bg-red-200 rounded-full opacity-40' />
                    </div>
                </div>



            </div>
        )
    }

export default EventsWithoutRecoryTab