import React from 'react'

const TimelineSkeleton = () => {
  return (
    <div className="flex animate-pulse flex-wrap items-center gap-8">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-300">
      </div>
      <div className="w-full">
        <div
          className="mb-4 h-3 w-full rounded-full bg-gray-300"
        >
          &nbsp;
        </div>
        <div
          className="mb-2 h-2 w-full rounded-full bg-gray-300"
        >
          &nbsp;
        </div>
        <div
          className="mb-2 h-2 w-full rounded-full bg-gray-300"
        >
          &nbsp;
        </div>
        <div
          className="mb-2 h-2 w-full rounded-full bg-gray-300"
        >
          &nbsp;
        </div>
        <div
          className="mb-2 h-2 w-full rounded-full bg-gray-300"
        >
          &nbsp;
        </div>
        <div
          className="mb-2 h-2 w-full rounded-full bg-gray-300"
        >
          &nbsp;
        </div>
        <div
          className="mb-2 h-2 w-72 rounded-full bg-gray-300"
        >
          &nbsp;
        </div>
      </div>
    </div>
  )
}

export default TimelineSkeleton