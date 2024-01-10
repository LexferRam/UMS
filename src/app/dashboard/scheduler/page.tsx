'use client'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/es';
import { AddEventModal } from './_components/AddEventModal';
import { useUserInfo, useWindowDimensions } from '@/hooks';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule'
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { calculateAge2 } from '@/util/dates'
import { useQuery } from 'react-query'
import SchedulerSkeleton from './_components/SchedulerSkeleton'

const EVENTS_TYPE_COLORS: any = {
  "RECUPERACION": "orange",
  "ENTREVISTA": "green",
  "SESION": "#3688d8", // TODO: color asignado al especialista
  "EVALUACION": "green",
  "ENTERVISTA_EVALUACION": "green",
}

const Scheduler = () => {

  const calendarRef: any = useRef(null)
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [userInfo] = useUserInfo()
  const { width } = useWindowDimensions();

  const {
    isLoading: isLoadingSchedulerEvents,
    status,
    error,
    data: schedulerEvents = [],
    refetch: refetchEvents
  } = useQuery(['sschedulerEvents', selectedUser], () =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/events`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ selectedUser })
    }).then(res =>
      res.json()
    ),
    {
      keepPreviousData: true,
    })

  const { data: dataUser = [] } = useQuery(['usersList'], () =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin`).then(res =>
      res.json()
    ))

  const formattedEventsQuery = schedulerEvents?.map((event: any) => ({
    ...event,
    color: EVENTS_TYPE_COLORS[event?.eventType],
    rrule: {
      freq: event?.freq || 'daily', // monthly  yearly  daily  weekly
      byweekday: event?.byweekday,
      dtstart: moment(event?.start).toDate(),
      until: moment(event?.end).toDate()
    },
    allDay: true,
    title: moment(event?.start).format('LT') + '-' + event?.title
  }))

  const onEventAdded = async (e: any) => {
    let calendarApi = calendarRef?.current?.getApi()
    e.setDisable(true)

    let newEvent = {
      title: moment(e?.start).format('LT') + '-' + e?.title,
      _asignTo: e.selectedUserValue,
      patient: e.selectedPatientValue,
      color: EVENTS_TYPE_COLORS[e.eventType],
      eventType: e.eventType,
      rrule: {
        freq: 'daily', // monthly  yearly  daily  weekly
        byweekday: e.selectedDaysArr,
        dtstart: moment(e.start).toDate(),
        until: moment(e.end).toDate()
      },
      allDay: true,
    }

    let { rrule, ...restnewEvent } = newEvent

    let newEventToDB = {
      ...restnewEvent,
      title: e?.title,
      start: newEvent.rrule.dtstart,
      end: newEvent.rrule.until,
      freq: newEvent.rrule.freq,
      byweekday: newEvent.rrule.byweekday,
      reports: [],
      _creator: userInfo[0]._id
    };

    await calendarApi.addEvent(newEvent)

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newEventToDB)
    })

    if (res.ok) {
      e.setOpen(false)
      await refetchEvents()
      e.setDisable(false)
      return res
    }
  }

  if (isLoadingSchedulerEvents || status !== "success") return <SchedulerSkeleton />
  if (error) return 'Error cargando'

  return (
    <div className='flex flex-col w-full shadow-xl rounded py-8 sm:px-4 scrollbar-hide'>

      {userInfo?.length > 0 && userInfo[0].role === 'admin' ? (
        <div className='flex gap-3'>

          <div>
            <select
              className='w-[250px]'
              onChange={(e) => {
                const foundItem: any = dataUser.filter((item: any) => item?.name === e.target.value)
                foundItem.length ? setSelectedUser(foundItem[0]._id) : setSelectedUser('')
              }}
            >
              <option key={''}>Todas las citas</option>
              {dataUser.map((user: any) => {
                return (
                  <option key={user._id}>{user.name}</option>
                )
              })}
            </select>
          </div>

          <AddEventModal
            open={open}
            setOpen={setOpen}
            onEventAdded={(e: any) => onEventAdded(e)}
          />

        </div>
      ) : null}

      <FullCalendar
        ref={calendarRef}
        events={formattedEventsQuery}
        plugins={[dayGridPlugin, interactionPlugin, rrulePlugin]}
        initialView={width as any < 500 ? "dayGridDay" : "dayGridMonth"}
        locale={esLocale}
        selectable
        headerToolbar={{
          left: 'prev,next,today',
          center: (width as any < 500) ? '' : 'title',
          right: 'dayGridDay,dayGridWeek,dayGridMonth'
        }}
        eventDidMount={(info) => {
          tippy(info.el, {
            animation: 'fade',
            trigger: 'click',
            touch: 'hold',
            allowHTML: true,
            content:
              `<div>
                  <div style="display: flex;">
                    <b>Nombre:</b><h3>${info.event.extendedProps.patient.name + ' ' + info.event.extendedProps.patient.lastname}</h3>
                  </div>

                  <div style="display: flex;">
                    <b>Fecha de Nacimiento:</b><h3>${moment(info.event.extendedProps.patient.dateOfBirth).format('LL')}</h3>
                  </div>
                  

                  <div style="display: flex;">
                    <b>Edad:</b><h3>${calculateAge2(info.event.extendedProps.patient.dateOfBirth)}</h3>
                  </div>

                  <div style="display: flex;">
                    <b>Diagnóstico:</b><h3>${info.event.extendedProps.patient.diagnosis}</h3>
                  </div>

                  <div style="display: flex;">
                    <b>MC:</b><h3>${info.event.extendedProps.patient.historyDescription}</h3>
                  </div>

                  <div style="display: flex; flex-direction: colunm">
                  <b>Especialistas cita:</b>
                    <h3>${info.event.extendedProps._asignTo.name}</h3>
                  </div>

                </div>`,
          });
        }}
        displayEventTime={true}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: true,
          meridiem: 'narrow'
        }}
      />
    </div>
  )
}

export default Scheduler


// <div style="display: flex; flex-direction: colunm">
// <b>Especialistas tratantes:</b>
// <h3>${info.event.extendedProps.patient.name}</h3>
// </div>