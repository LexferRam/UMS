'use client'
import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/es';
import { AddEventModal } from './_components/AddEventModal';
import moment from 'moment'
import { useUserInfo } from '@/hooks';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule'

const Scheduler = () => {

  const calendarRef: any = useRef(null)
  const [events, setEvents] = useState([]) as any
  const [userInfo] = useUserInfo()

  const onEventAdded = async (e: any) => {
    let calendarApi = calendarRef?.current?.getApi() 

    let newEvent = {
      title: e.title,
      start: moment(e.start).toDate(),
      end: moment(e.end).toDate(),
      _asignTo: e.selectedUserValue,
      patient: e.selectedPatientValue,
      // rrule: {
      //   freq: 'weekly', // monthly  yearly  DAILY  weekly
      //   interval: 3,
      //   byweekday: [],
      //   dtstart: moment(e.start).toDate(), // will also accept '20120201T103000'
      //   until: moment(e.end).toDate()// will also accept '20120201'
      // }
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
    <div className='flex flex-col w-full shadow-xl rounded py-8 sm:px-4'>

      {userInfo?.length > 0 && userInfo[0].role === 'admin' ? (
        <AddEventModal onEventAdded={(e: any) => onEventAdded(e)} />
      ) : null}

      <FullCalendar
        ref={calendarRef}
        events={events}
        plugins={[dayGridPlugin, interactionPlugin, rrulePlugin]}
        // initialView="dayGridWeek"
        locale={esLocale}
        // droppable
        // editable
        selectable
        // eventDrop={(eventEl) => {
        //   console.log(eventEl)
        //   alert('update event')
        // }}
        // dateClick= {function(info) {
        //   alert('Clicked on: ' + info.dayEl);
        //   alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
        //   alert('Current view: ' + info.view.type);
        //   // change the day's background color just for fun
        //   info.dayEl.style.backgroundColor = 'red';
        // }}
        // eventAdd={(event) => handleEventAdd(event)}
        // weekends={false}
        headerToolbar={{
          left: 'prev,next,today',
          center: 'title',
          right: 'dayGridDay dayGridWeek dayGridMonth'
        }}
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