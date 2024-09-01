import React, { FC } from 'react'
import { UserIcon } from '@heroicons/react/24/outline';

const MyPatientsTab: FC<{
    setSelectedCard: any,
    tableContainerRef: any,
    patientListActivatedOrDesactivated: any
}> = ({
    setSelectedCard,
    tableContainerRef,
    patientListActivatedOrDesactivated
}) => {
        return (
            <div onClick={() => {
                setSelectedCard('patients')
                tableContainerRef.current.scrollIntoView({ behavior: 'smooth' })
            }}
                className="relative overflow-hidden p-5 bg-amber-50 rounded-2xl shadow-xl hover:shadow-2xl cursor-pointer"
            >
                <div className="flex items-center space-x-2 space-y-3">

                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 ">
                        <UserIcon className="h-9 w-9 text-amber-400" strokeWidth={2} />
                    </div>

                    <div className='flex flex-col items-center'>
                        <div className="text-amber-800 text-center font-semibold">Mis Pacientes</div>
                        <div className="text-2xl font-bold text-amber-900">
                            {patientListActivatedOrDesactivated?.filter(Boolean).length}
                        </div>
                    </div>

                    <div>
                        <div className='absolute -top-1/4 -right-12 w-[100px] h-[100px] bg-amber-200 rounded-full opacity-40' />
                        <div className='absolute -bottom-1/4 -right-16 w-[100px] h-[100px] bg-amber-200 rounded-full opacity-40' />
                        <div className='absolute -bottom-1/4 -left-16 w-[100px] h-[100px] bg-amber-200 rounded-full opacity-40' />
                        <div className='absolute -top-1/4 -left-16 w-[100px] h-[100px] bg-amber-200 rounded-full opacity-40' />
                    </div>

                </div>
            </div>
        )
    }

export default MyPatientsTab