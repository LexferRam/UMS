import { Typography } from '@material-tailwind/react'
import React from 'react'

const SchedulerSkeleton = () => {
    return (
        <div className="flex animate-pulse flex-wrap items-center gap-8 pt-10">
            <div
                className=" h-10 w-full rounded bg-gray-300"
            >
                &nbsp;
            </div>

            <div className="w-full">
                <div
                    className="mb-8 h-[500px] w-full rounded bg-gray-300"
                >
                    &nbsp;
                </div>
            </div>
        </div>
    )
}

export default SchedulerSkeleton