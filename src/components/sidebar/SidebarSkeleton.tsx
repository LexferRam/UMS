import React from 'react'

const SidebarSkeleton = () => {
    return (
        <>
            {
                [1, 2, 3].map((item, i) => (
                    <div key={i} className="flex flex-col animate-pulse flex-wrap items-start justify-start gap-4 pt-10">
                        <div
                            className=" h-5 w-[70px] rounded bg-gray-300"
                        >
                            &nbsp;
                        </div>
                        <div
                            className=" h-14 w-[198px] rounded bg-gray-300"
                        >
                            &nbsp;
                        </div>
                    </div>
                ))
            }
        </>
    )
}

export default SidebarSkeleton