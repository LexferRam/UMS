'use client'

import moment from 'moment'
import React, { useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/es';
import { AddEventModal } from './_components/AddEventModal';
import { useUserInfo, useWindowDimensions } from '@/hooks';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule'
import 'tippy.js/dist/tippy.css';
import { useQuery } from 'react-query'
import SchedulerSkeleton from './_components/SchedulerSkeleton'
import EventDetailsModal from './_components/EventDetailsModal'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
moment.locale('es');

const filterEventsForView = (events: any, viewName: any) => {
  return events.filter((event: any) => {
    if (viewName === 'dayGridDay' || viewName === 'timeGridWeek') {
      console.log(event)
      return event.allDay === false; // Show non-all-day events
    } else {
      return true; // Show all events in other views
    }
  });
};

const EVENTS_TYPE_COLORS: any = {
  "RECUPERACION": "#f9b94f",
  "ENTREVISTA": "#008001",
  "SESION": "#3688d8", // TODO: color asignado al especialista
  "EVALUACION": "#008001",
  "ENTERVISTA_EVALUACION": "#008001",
}

const Scheduler = () => {

  const calendarRef: any = useRef(null)
  const [open, setOpen] = useState(false)
  const [openDetails, setOpenDetails] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [userInfo] = useUserInfo()
  const { width } = useWindowDimensions();
  const [currentEvent, setCurrentEvent] = useState<any>()

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

  const formattedEventsQuery = schedulerEvents?.map((event: any) => {
    console.log(event)

    let { start, end, color,...restEvent} =  event
    if (event?.byweekday.length > 0) {


      // ? JSON para un evento con recurrencia
      // TODO: No se estan mostrando los rangos de horas del evento recurrente
      return ({
        ...restEvent,
        color: event?.eventType === 'SESION' ? event?._asignTo.asignColor : EVENTS_TYPE_COLORS[event?.eventType],
        rrule: {
          freq: event?.freq || 'daily', // monthly  yearly  daily  weekly
          byweekday: event?.byweekday,
          dtstart: new Date(event?.start).toISOString(),//moment(event?.start).toDate(),// event?.start,
          until: new Date(event?.end).toISOString()//moment(event?.end).toDate() //event?.end
        },
        allDay: calendarRef?.current?.props?.initialView === 'resourceTimeGridWeek' || calendarRef?.current?.props?.initialView === 'resourceTimeGridDay' ? false : true,
        // title: event?.title,
        // TODO: add this dinamically
        resourceId: "a",
      })
    } else {

      // ? JSON para un evento sin recurrencia
      return ({
        ...event,
        color:  event?.eventType === 'SESION' ? event?._asignTo.asignColor : EVENTS_TYPE_COLORS[event?.eventType],
        allDay: calendarRef?.current?.props?.initialView === 'resourceTimeGridWeek' || calendarRef?.current?.props?.initialView === 'resourceTimeGridDay' ? false : true,
        // title: event?.title,
        // TODO: add this dinamically
        resourceId: "a",
        start: new Date(event?.start).toISOString(),//moment(event?.start).toDate(), //
        end: new Date(event?.end).toISOString(),//moment(event?.end).toDate() // 
      })
    }
  })

  console.log(formattedEventsQuery)

  const onEventAdded = async (e: any) => {
    let calendarApi = calendarRef?.current?.getApi()

    let newEvent = {
      title: e?.title,
      _asignTo: e.selectedUserValue,
      patient: e.selectedPatientValue,
      color: EVENTS_TYPE_COLORS[e.eventType],
      eventType: e.eventType,
      rrule: {
        freq: 'daily', // monthly  yearly  daily  weekly
        byweekday: e.selectedDaysArr,
        dtstart:  new Date(e?.start).toISOString(),//moment(e.start).toDate(),
        until:  new Date(e?.end).toISOString(), //moment(e.end).toDate()
      },
      allDay: false,
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

    console.log(newEventToDB)

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
      e.reset()
      e.setActive(false)
      e.setSelectedDays(new Array(7).fill(false))
      return res
    }
  }

  if (isLoadingSchedulerEvents || status !== "success") return <SchedulerSkeleton />
  if (error) return 'Error cargando'

  return (
    <div className='flex flex-col w-full lg:shadow-xl rounded py-8 sm:px-4 scrollbar-hide'>

      <EventDetailsModal open={openDetails} setOpen={setOpenDetails} eventDetails={currentEvent} />

      {userInfo?.length > 0 && userInfo[0].role === 'admin' ? (
        <div className='flex flex-col m-1 sm:flex-row gap-3'>

          <div>
            <select
              className='sm:w-[250px]'
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
        viewClassNames='h-[100vh]'
        // eventStyle={{
        //   backgroundColor: 'lightblue',
        //   borderColor: 'blue',
        //   borderWidth: '2px',
        //   borderRadius: '5px',
        // }}
        events={formattedEventsQuery}
        //   events={formattedEventsQuery.sort((event1: any, event2: any) => {
        //     const start1 = new Date(event1.start);
        //   const start2 = new Date(event2.start);
        //   return start1.getHours() - start2.getHours();
        // })}
        // eventOrder={(event1: any, event2: any) => {
        //   const start1 = new Date(event1?.start / 1000);
        //   const start2 = new Date(event2?.start / 1000);

        //   return start1?.getHours() - start2?.getHours();
        // }}
        plugins={[dayGridPlugin, interactionPlugin, rrulePlugin, resourceTimeGridPlugin]}
        initialView={width as any < 500 ? "resourceTimeGridDay" : "resourceTimeGridWeek"} //dayGridWeek 
        locale={esLocale}
        selectable
        headerToolbar={{
          left: 'prev,next,today',
          center: (width as any < 500) ? '' : 'title',
          right: (width as any < 500) ? 'resourceTimeGridDay,resourceTimeGridWeek' : 'resourceTimeGridDay,resourceTimeGridWeek,dayGridMonth'
          // right: 'dayGridDay,dayGridWeek,dayGridMonth,resourceTimeGridDay,resourceTimeGridFourDay'
        }}
        displayEventTime={true}
        eventTimeFormat={
          {
            hour12: true, // Use 12-hour format
            hour: 'numeric', // Display hours with 1 or 2 digits
            minute: '2-digit', // Display minutes with 2 digits
          }
        }
        eventClick={function (info) {
          console.log(info.event?.extendedProps?.byweekday)
          console.log(info?.event?._instance?.range)
          setCurrentEvent(info.event._def)
          setOpenDetails(true)
        }}
        resources={[
          { id: 'a', title: 'Citas hoy' },
          // { id: 'b', title: 'Citas hoy2' },
          // { id: 'c', title: 'Citas hoy2' },
          // { id: 'd', title: 'Citas hoy2' },
          // { id: 'e', title: 'Citas hoy2' },
          // { id: 'f', title: 'Citas hoy2' },
          // { id: 'g', title: 'Citas hoy2' },
        ]}
        timeZone='local'
        slotLabelFormat={{ hour: 'numeric', hour12: true }}
        slotMinTime='07:00:00'
        views={{
          resourceTimeGridDay: {
            type: 'resourceTimeGrid',
            duration: { days: 1 },
            buttonText: 'Día'
          },
          resourceTimeGridWeek: {
            type: 'resourceTimeGrid',
            duration: { week: 1 },
            buttonText: 'Semana'
          }
        }}
        hiddenDays={[0]}
        // eventClassNames= {[ 'bg-red-500' ]}
        eventContent={(eventInfo) => {
          console.log(eventInfo)
          const { event } = eventInfo;

          let eventType = event._def.extendedProps.eventType;
          let asingColor = event._def.extendedProps._asignTo.asignColor
          let bgColor = EVENTS_TYPE_COLORS[eventType]//`${!eventType ? '' : EVENTS_TYPE_COLORS[eventType]}`

          return (
            <div
              className={`text-white w-full h-full m-0 p-0 text-xs`}
              style={{
                borderLeft: `${userInfo[0]?.role === 'admin' ? '10px' : '0px'} ${asingColor} solid`,
                overflow: 'hidden',
                backgroundColor: `${eventType === 'SESION' ? asingColor : bgColor }`,
                borderRadius: '5px'
              }}
            >
              <p>{eventInfo.timeText}</p>
              <p>{event._def.title}</p>
            </div>
          );
        }}

      />
    </div>
  )
}

export default Scheduler
