'use client'

import moment from 'moment'
import React, { useContext, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/es';

import { useWindowDimensions } from '@/hooks';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule'
import 'tippy.js/dist/tippy.css';
import { useQuery } from 'react-query'
import SchedulerSkeleton from '../_components/SchedulerSkeleton'

import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { getHoursBetweenToTimes } from '@/util/hours'
import { EVENTS_TYPE_COLORS } from '@/util/eventsType'
import { LoadingContext } from '@/context/LoadingProvider'
import { useSnackbar } from 'notistack'

import dynamic from 'next/dynamic'
import { Autocomplete, TextField } from '@mui/material'
import Image from 'next/image'
import { SPECIALITIES_VALUES_DICTIONARY } from '../../adminUsers/constants'
import dayjs from 'dayjs'
const EventDetailsModal = dynamic(() => import('../_components/EventDetailsModal'))
const AddEventModal = dynamic(() => import('../_components/AddEventModal'))
import es from 'dayjs/locale/es';

moment.locale('es');
dayjs.locale(es);

const SchedulerPage = ({ userInfo, events }: any) => {

  const calendarRef: any = useRef(null)
  const [open, setOpen] = useState(false)
  const [selectSearchOpt, setSelectSearchOpt] = useState({ name: 'Todas las citas', speciality: 'Todas las citas' })
  const [openDetails, setOpenDetails] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const { width } = useWindowDimensions();
  const [currentEvent, setCurrentEvent] = useState<any>()
  const [selectedDate, setSelectedDate] = useState<any>()
  const { setLoading } = useContext(LoadingContext) as any
  const { enqueueSnackbar } = useSnackbar()

  const {
    isLoading: isLoadingSchedulerEvents,
    status,
    error,
    data: schedulerEvents,
    refetch: refetchEvents
  } = useQuery(['events', selectedUser], async ({ signal }) =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/events`, {
      signal,
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
      // refetchOnWindowFocus: true,
      initialData: JSON.parse(events)
    })

  const { data: dataUser = [], isLoading: isLoadingDateUser } = useQuery(['usersList'], async ({ signal }) =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin`, { signal }).then(res =>
      res.json()
    ),
    {
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnWindowFocus: false,
    })

  const formattedEventsQuery = schedulerEvents?.map((event: any) => {

    let { start, end, color, ...restEvent } = event
    if (event?.byweekday.length > 0) {

      let startTime = new Intl.DateTimeFormat('es-VE', {
        hour: 'numeric',
        minute: "numeric",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Use your local time zone
        hour12: false // Use 24-hour format by default
      }).format(new Date(event?.start))

      let endTime = new Intl.DateTimeFormat('es-VE', {
        hour: 'numeric',
        minute: "numeric",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Use your local time zone
        hour12: false // Use 24-hour format by default
      }).format(new Date(event?.end))

      // ? JSON para un evento con recurrencia
      // TODO: No se estan mostrando los rangos de horas del evento recurrente
      return (
        {
          ...restEvent,
          color: userInfo[0].role === 'admin' ? (event?.eventType === 'SESION' ? event?._asignTo.asignColor : EVENTS_TYPE_COLORS[event?.eventType]) : '#3688d8',
          duration: { minutes: getHoursBetweenToTimes(startTime, endTime) },
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
        }
      )
    } else {

      // ? JSON para un evento sin recurrencia
      return ({
        ...event,
        color: userInfo[0].role === 'admin' ? (event?.eventType === 'SESION' ? event?._asignTo.asignColor : EVENTS_TYPE_COLORS[event?.eventType]) : '#3688d8',
        // rrule: {
        //   freq: event?.freq || 'daily', // monthly  yearly  daily  weekly
        //   byweekday: event?.byweekday,
        //   dtstart: new Date(event?.start).toISOString(),//moment(event?.start).toDate(),// event?.start,
        //   until: new Date(event?.end).toISOString()//moment(event?.end).toDate() //event?.end
        // },
        allDay: calendarRef?.current?.props?.initialView === 'resourceTimeGridWeek' || calendarRef?.current?.props?.initialView === 'resourceTimeGridDay' ? false : true,
        // title: event?.title,
        // TODO: add this dinamically
        resourceId: "a",
        start: new Date(event?.start).toISOString(),//moment(event?.start).toDate(), //
        end: new Date(event?.end).toISOString(),//moment(event?.end).toDate() // 
      })
    }
  })

  const onEventAdded = async (e: any) => {
    try {
      setLoading(true)
      let calendarApi = calendarRef?.current?.getApi()

      let startTime = new Intl.DateTimeFormat('es-VE', {
        hour: 'numeric',
        minute: "numeric",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Use your local time zone
        hour12: false // Use 24-hour format by default
      }).format(new Date(e?.start))

      let endTime = new Intl.DateTimeFormat('es-VE', {
        hour: 'numeric',
        minute: "numeric",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Use your local time zone
        hour12: false // Use 24-hour format by default
      }).format(new Date(e?.end))

      let newEvent = {
        title: e?.title,
        _asignTo: e.selectedUserValue,
        patient: e.selectedPatientValue,
        color: EVENTS_TYPE_COLORS[e.eventType],
        eventType: e.eventType,
        duration: { minutes: getHoursBetweenToTimes(startTime, endTime) },
        rrule: {
          freq: 'daily', // monthly  yearly  daily  weekly
          byweekday: e.selectedDaysArr,
          dtstart: new Date(e?.start).toISOString(),//moment(e.start).toDate(),
          until: new Date(e?.end).toISOString(), //moment(e.end).toDate()
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
        e.setIsAddingEvent(false)
        setLoading(false)
        enqueueSnackbar('Cita creada exitosamente!', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          autoHideDuration: 5000,
          key: 'error-delete-event'
        })
        return res
      }
    } catch (error) {
      setLoading(false)
      enqueueSnackbar('Error creando cita', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        autoHideDuration: 5000,
        key: 'error-delete-event'
      })
    }
  }

  if (error) return 'Error cargando'

  const options = dataUser.map((option: any) => {
    const specialityGroup = option.speciality.length === 0 ? 'Administradores' : option.speciality.trim()
    return {
      specialityGroup: specialityGroup,
      ...option,
    };
  });

  return (
    <div className='flex flex-col w-full lg:shadow-xl rounded sm:py-8 sm:px-4 scrollbar-hide'>
      <EventDetailsModal
        open={openDetails}
        setOpen={setOpenDetails}
        eventDetails={currentEvent}
        selectedDate={selectedDate}
        refetchEvents={refetchEvents}
      />

      {userInfo?.length > 0 && userInfo[0].role === 'admin' ? (
        <div className='flex flex-col m-1 sm:flex-row gap-6 mb-6'>

          <div className='flex items-center flex-wrap gap-4 md:gap-4'>

            <Autocomplete
              value={selectSearchOpt}
              onChange={(event: any, newValue: any) => {
                setSelectSearchOpt(newValue)
                const foundItem: any = dataUser.filter((item: any) => item?.name === newValue?.name)
                foundItem.length ? setSelectedUser(foundItem[0]._id) : setSelectedUser('')
              }}
              options={[...options.sort((a: any, b: any) => b.specialityGroup.localeCompare(a.specialityGroup)), { name: "Todas las citas", speciality: 'Todas las citas', specialityGroup: 'Todas las citas' }]}
              groupBy={(option: any) => option?.speciality.length === 0 ? 'Administrador' : SPECIALITIES_VALUES_DICTIONARY[option?.speciality]}
              getOptionLabel={(option: any) => option.name}
              className='w-full sm:w-[300px] md:ml-2'
              renderInput={(params) => <TextField {...params} label="Filtro por especialista" />}
              renderOption={(props: any, option: any) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    <div className='flex gap-1'>
                      <Image
                        src={option.lastname || '/icon-512x512.png'}
                        className="rounded-full mr-2"
                        alt='logo_login'
                        width={25}
                        height={25}
                        priority
                      />
                      <p >
                        {option.name}
                      </p>
                    </div>
                  </li>
                );
              }}
            />
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
        events={formattedEventsQuery}
        plugins={[dayGridPlugin, interactionPlugin, rrulePlugin, resourceTimeGridPlugin]}
        initialView={width as any < 500 ? "resourceTimeGridDay" : "resourceTimeGridWeek"} //dayGridWeek 
        locale={esLocale}
        selectable
        headerToolbar={{
          left: 'prev,next,today',
          center: (width as any < 500) ? '' : 'title',
          right: "timeGridDay,timeGridWeek,dayGridMonth"
        }}
        displayEventTime={false}
        eventTimeFormat={
          {
            hour12: true, // Use 12-hour format
            hour: 'numeric', // Display hours with 1 or 2 digits
            minute: '2-digit', // Display minutes with 2 digits
          }
        }
        eventClick={function (info: any) {
          let eventId = info.event._def.extendedProps._id
          let selectedEvent = formattedEventsQuery.filter((event: any) => event._id === eventId)

          setSelectedDate({
            eventId: info.event._def.extendedProps._id,
            date: info.event._instance?.range.start.toLocaleString("es-VE").split(',')[0],
            patient: info.event._def.extendedProps.patient
          })

          setCurrentEvent(selectedEvent[0])
          setOpenDetails(true)
        }}
        resources={[
          { id: 'a', title: ' ' }
        ]}
        timeZone='local'
        slotLabelFormat={{ hour: 'numeric', hour12: true }}
        slotMinTime='07:00:00'
        slotMaxTime='19:00:00'
        allDaySlot={false}
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
        eventContent={(eventInfo) => {
          const { event } = eventInfo;

          let eventType = event._def.extendedProps.eventType;
          let asingColor = event._def.extendedProps._asignTo.asignColor
          let bgColor = EVENTS_TYPE_COLORS[eventType]

          return (
            <div
              className={`text-white w-full h-full m-0 p-0 text-xs cursor-pointer`}
              style={{
                borderLeft: `${userInfo[0]?.role === 'admin' ? '10px' : '0px'} ${asingColor} solid`,
                overflow: 'hidden',
                backgroundColor: `${(
                  event._def.extendedProps?.reports?.filter((repor: any) => repor?.isForEventCancel &&
                    new Date(repor.createdAt).toLocaleString("es-VE").split(',')[0] === event._instance?.range.start.toLocaleString("es-VE").split(',')[0]
                  ).length > 0
                ) ?
                  'red' :
                  (userInfo[0].role === 'admin' ? (
                    eventType === 'SESION' ? asingColor : bgColor)
                    : eventType === 'SESION' ? '#3688d8' : bgColor)
                  }`,
                borderRadius: '5px'
              }}
            >
              <p>{eventInfo.timeText}</p>
              <p>{event._def.title}</p>
            </div>
          );
        }}
        nowIndicator
      />
    </div>
  )
}

export default SchedulerPage
