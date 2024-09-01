import React from 'react'
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import Link from "next/link"

const ViewCalendarTab = () => {
    return (
        <Link
            href="/dashboard/scheduler">
            <div className="relative overflow-hidden p-5 bg-emerald-50 rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer">
                <div className="flex items-center space-x-2 space-y-3 ">

                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 min-h-[90px]">
                        <CalendarDaysIcon className="h-9 w-9 text-emerald-400" strokeWidth={2} />
                    </div>

                    <div className='flex flex-col items-center'>
                        <div className="text-esmerald-800 text-center font-semibold">
                            Ver Calendario
                        </div>
                        <div className="text-2xl font-bold text-esmerald-900"></div>
                    </div>

                    <div>
                        <div className='absolute -top-1/4 -right-12 w-[100px] h-[100px] bg-emerald-200 rounded-full opacity-40' />
                        <div className='absolute -bottom-1/4 -right-16 w-[100px] h-[100px] bg-emerald-200 rounded-full opacity-40' />
                        <div className='absolute -bottom-1/4 -left-16 w-[100px] h-[100px] bg-emerald-200 rounded-full opacity-40' />
                        <div className='absolute -top-1/4 -left-16 w-[100px] h-[100px] bg-emerald-200 rounded-full opacity-40' />
                    </div>

                </div>
            </div>
        </Link>
    )
}

export default ViewCalendarTab