import React, { FC } from 'react'
import { FolderIcon } from '@heroicons/react/24/outline';

const EventsForTodayTab: FC<{
    setSelectedCard: any,
    tableContainerRef: any,
    eventForToday: any,
    userEvent: any
}> = ({
    setSelectedCard,
    tableContainerRef,
    eventForToday,
    userEvent
}) => {
    return (
        <div
            onClick={() => {
                setSelectedCard('events')
                tableContainerRef.current.scrollIntoView({ behavior: 'smooth' })
            }}
            className="relative overflow-hidden p-5 bg-fuchsia-50 rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer"
        >
            <div className="flex items-center space-x-2 space-y-3">

                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-50 min-h-[90px]">
                    <FolderIcon className="h-9 w-9 text-fuchsia-400" strokeWidth={2} />
                </div>

                <div className='flex flex-col items-center'>
                    <div className="text-fuchsia-800 text-center font-semibold">Citas para hoy</div>
                    <div className="text-2xl font-bold text-fuchsia-900">{eventForToday(userEvent)?.length}</div>
                </div>

                <div>
                    <div className='absolute -top-1/4 -right-12 w-[100px] h-[100px] bg-fuchsia-200 rounded-full opacity-40' />
                    <div className='absolute -bottom-1/4 -right-16 w-[100px] h-[100px] bg-fuchsia-200 rounded-full opacity-40' />
                    <div className='absolute -bottom-1/4 -left-16 w-[100px] h-[100px] bg-fuchsia-200 rounded-full opacity-40' />
                    <div className='absolute -top-1/4 -left-16 w-[100px] h-[100px] bg-fuchsia-200 rounded-full opacity-40' />
                </div>

            </div>
        </div>
    )
}

export default EventsForTodayTab