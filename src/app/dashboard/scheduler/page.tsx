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
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { formatDate } from '@/util/dates';

export const EVENTS_TYPE_COLORS: any = {
  "entrevista"           : "red",
  "session"              : "orange",
  "evaluacion"           : "green",
  "entervista_evaluacion": "blue"
}

const Scheduler = () => {

  const calendarRef: any = useRef(null)
  const [events, setEvents] = useState([]) as any
  const [userInfo] = useUserInfo()

  const onEventAdded = async (e: any) => {
    let calendarApi = calendarRef?.current?.getApi()
    console.log(e.eventType)

    let newEvent = {
      title: e.title,
      start: moment(e.start).toDate(),
      end: moment(e.end).toDate(),
      _asignTo: e.selectedUserValue,
      patient: e.selectedPatientValue,
      color: EVENTS_TYPE_COLORS[e.eventType],
      eventType: e.eventType
      // rrule: {
      //   freq: 'weekly', // monthly  yearly  DAILY  weekly
      //   interval: 3,
      //   byweekday: [],
      //   dtstart: moment(e.start).toDate(), 
      //   until: moment(e.end).toDate()
      // }
    }

    let  {color, ...restEvent} = newEvent;

    await calendarApi.addEvent(newEvent)

    const res = await fetch('http://localhost:3000/api/admin', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(restEvent)
    })

    if (res.ok) {
      return res
    }
  }


  useEffect(() => {
    const getEvents = async () => {
      let respEvents = await fetch('http://localhost:3000/api/admin/events')
      let eventsDB = await respEvents.json()

      const formattedEvents = eventsDB.map((event: any) => ({
        ...event,
        color: EVENTS_TYPE_COLORS[event.eventType],
      }))
      console.log(formattedEvents)
      setEvents(formattedEvents)
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
        eventDidMount={(info) => {
          // console.log(info.event.extendedProps)
          tippy(info.el, {
            animation: 'fade',
            trigger: 'click',
            touch: 'hold',
            allowHTML: true,
            content:
              `<div>
                  <div style="display: flex;">
                    <b>Nombre:</b><h3>${info.event.extendedProps.patient.name}</h3>
                  </div>

                  <div style="display: flex;">
                    <b>Fecha de Nacimiento:</b><h3>${info.event.extendedProps.patient.name}</h3>
                  </div>

                  <div style="display: flex;">
                    <b>Edad:</b><h3>${info.event.extendedProps.patient.name}</h3>
                  </div>

                  <div style="display: flex;">
                    <b>Diagnóstico:</b><h3>${info.event.extendedProps.patient.name}</h3>
                  </div>

                  <div style="display: flex;">
                    <b>MC:</b><h3>${info.event.extendedProps.patient.name}</h3>
                  </div>

                  <div style="display: flex; flex-direction: colunm">
                    <b>Especialistas tratantes:</b>
                    <h3>${info.event.extendedProps.patient.name}</h3>
                  </div>

                  <div style="display: flex; flex-direction: colunm">
                  <b>Especialistas cita:</b>
                    <h3>${info.event.extendedProps._asignTo.name}</h3>
                  </div>

                </div>`,
          });
        }}
      />
    </div>
  )
}

export default Scheduler