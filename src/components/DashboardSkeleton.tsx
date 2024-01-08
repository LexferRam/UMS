'use client'

const DashboardSkeleton = () => {
    return (
        <div className="flex animate-pulse flex-wrap items-center justify-center sm:justify-start gap-8 sm:pt-10">
            <div className="flex justify-center gap-8 flex-wrap">
                <div className="rounded bg-gray-300 w-[280px] h-[100px] sm:h-[150px] sm:w-[240px]">
                &nbsp;
                </div>
                <div className="rounded bg-gray-300 w-[280px] h-[100px] sm:h-[150px] sm:w-[240px]">
                &nbsp;
                </div>
                <div className="rounded bg-gray-300 w-[280px] h-[100px] sm:h-[150px] sm:w-[240px]">
                &nbsp;
                </div>
            </div>

            <div className="w-full m-4 sm:m-2">
                <div
                    className="mb-8 h-16 w-full rounded bg-gray-300"
                >
                    &nbsp;
                </div>
                <div
                    className="mb-8 h-8 w-full rounded-full bg-gray-300"
                >
                    &nbsp;
                </div>
                <div
                    className="mb-8 h-8 w-full rounded-full bg-gray-300"
                >
                    &nbsp;
                </div>
                <div
                    className="mb-8 h-8 w-full rounded-full bg-gray-300"
                >
                    &nbsp;
                </div>
                <div
                    className="mb-8 h-8 w-full rounded-full bg-gray-300"
                >
                    &nbsp;
                </div>
                <div
                    className="mb-8 h-8 w-full rounded-full bg-gray-300"
                >
                    &nbsp;
                </div>
                <div
                    className="mb-8 h-8 w-full rounded-full bg-gray-300"
                >
                    &nbsp;
                </div>

            </div>
        </div>
    )
}

export default DashboardSkeleton