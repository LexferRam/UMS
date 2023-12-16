'use client'
import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import esLocale from '@fullcalendar/core/locales/es';
import { AddEventModal } from './_components/AddEventModal';
import moment from 'moment'

const Scheduler = () => {

  const calendarRef = useRef(null)
  const [events, setEvents] = useState([]) as any

  const onEventAdded = async (e: any) => {
    let calendarApi = calendarRef?.current?.getApi()

    let newEvent = {
      title: e.title,
      start: moment(e.start).toDate(),
      end: moment(e.end).toDate(),
      _asignTo: e.selectedValue
    }

    await calendarApi.addEvent(newEvent)

    const res = await fetch('http://localhost:3000/api/admin', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newEvent)
    })

    if (res.ok) {
      return res
    }
  }


  useEffect(() => {
    const getEvents = async () => {
      let respEvents = await fetch('http://localhost:3000/api/admin/events')
      let eventsDB = await respEvents.json()  
      setEvents(eventsDB)

      // await calendarApi.addEvent(newEvent)
    }

    getEvents()
  
  }, [])
  

  return (
    <div className='flex flex-col w-full'>

      <AddEventModal onEventAdded={(e: any) => onEventAdded(e)} />

      <FullCalendar
        ref={calendarRef}
        events={events}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale={esLocale}
        // eventAdd={(event) => handleEventAdd(event)}
        // weekends={true}
        // headerToolbar={{center: 'dayGridMonth,timeGridWeek,timeGridDay'}}
        // eventClick={
        //   function(arg){
        //     console.log(arg.event)
        //   }
        // }
      />
    </div>
  )
}

export default Scheduler