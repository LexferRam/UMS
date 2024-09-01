import { EVENTS_TYPE_COLORS } from '@/util/eventsType'
import React from 'react'

const EventTypeChip = ({
    eventType
}: {
    eventType: string
}) => {
    return (
        <span
            className="ml-2 inline-block rounded-full px-3 py-1 text-[10px] font-light text-white mr-2 mb-2"
            style={{
                backgroundColor: EVENTS_TYPE_COLORS[eventType]
            }}
        >
            {eventType}
        </span>
    )
}

export default EventTypeChip