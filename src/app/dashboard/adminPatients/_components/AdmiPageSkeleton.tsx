import { Typography } from '@material-tailwind/react'
import React from 'react'

const AdmiPageSkeleton = () => {
    return (
        <div className="flex animate-pulse flex-wrap items-center gap-8 pt-10">
             <Typography
                    as="div"
                    variant="h1"
                    className=" h-10 w-52 rounded bg-gray-300"
                >
                    &nbsp;
                </Typography>

            <div className="w-full">
                <Typography
                    as="div"
                    variant="h1"
                    className="mb-8 h-16 w-full rounded bg-gray-300"
                >
                    &nbsp;
                </Typography>
                <Typography
                    as="div"
                    variant="paragraph"
                    className="mb-8 h-8 w-full rounded-full bg-gray-300"
                >
                    &nbsp;
                </Typography>
                <Typography
                    as="div"
                    variant="paragraph"
                    className="mb-8 h-8 w-full rounded-full bg-gray-300"
                >
                    &nbsp;
                </Typography>
                <Typography
                    as="div"
                    variant="paragraph"
                    className="mb-8 h-8 w-full rounded-full bg-gray-300"
                >
                    &nbsp;
                </Typography>
                <Typography
                    as="div"
                    variant="paragraph"
                    className="mb-8 h-8 w-full rounded-full bg-gray-300"
                >
                    &nbsp;
                </Typography>
                <Typography
                    as="div"
                    variant="paragraph"
                    className="mb-8 h-8 w-full rounded-full bg-gray-300"
                >
                    &nbsp;
                </Typography>
                <Typography
                    as="div"
                    variant="paragraph"
                    className="mb-8 h-8 w-full rounded-full bg-gray-300"
                >
                    &nbsp;
                </Typography>

            </div>
        </div>
    )
}

export default AdmiPageSkeleton