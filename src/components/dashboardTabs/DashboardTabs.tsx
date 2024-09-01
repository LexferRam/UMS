'use client'
import { FC, Suspense, useRef, useState } from 'react'
import dynamic from 'next/dynamic';
import EventsTable from '../eventsTable/EventsTable';
import AdmiPageSkeleton from '@/app/dashboard/adminPatients/_components/AdmiPageSkeleton';
import { EventsForTodayTab, EventsWithoutRecoryTab, MissingReports, MyPatientsTab } from './Tabs';
import ViewCalendarTab from './Tabs/ViewCalendarTab';

const MissingReportsTable = dynamic(() => import("../MissingReportsTable"), {
    ssr: true,
    loading: () => <AdmiPageSkeleton />
})
const ReportsTable = dynamic(() => import("../ReportsTable"), {
    ssr: true,
    loading: () => <AdmiPageSkeleton />
})
const PatientTable = dynamic(() => import("@/app/dashboard/adminPatients/_components/PatientTable"), {
    ssr: true,
    loading: () => <AdmiPageSkeleton />
})

const DashboardTabs: FC<{
    userInfo: any,
    userReports: any,
    userEvent: any,
    missingReportsWithDate: any,
    refecthFns: any
}> = ({ userInfo, userReports, userEvent, missingReportsWithDate, refecthFns }) => {
    const tableContainerRef = useRef(null) as any;

    function isDateWithinRange(today: any, startDate: any, endDate: any, event: any) {
        today = today.setHours(0, 0, 0, 0).toLocaleString("es-VE")
        startDate = new Date(startDate).setHours(0, 0, 0, 0).toLocaleString("es-VE")
        endDate = new Date(endDate).setHours(0, 0, 0, 0).toLocaleString("es-VE")
        return today >= startDate && today <= endDate;
    }

    const eventForToday = (eventsArray: any) => {
        let daysWeek: any = {
            mo: 1,
            tu: 2,
            we: 3,
            th: 4,
            fr: 5,
            sa: 6,
            su: 7
        }

        let eventsForTodayArray: any[] = []

        eventsArray?.map((event: any) => {
            const today = new Date();
            if (event.byweekday.length > 0) {
                event.byweekday.forEach((dayWeek: any) => {
                    if (daysWeek[dayWeek] === today.getDay()) {
                        isDateWithinRange(today, event.start, event.end, event) && eventsForTodayArray.push(event)
                    }
                })
            }
            if (event.byweekday.length === 0) {
                isDateWithinRange(today, event.start, event.end, event) && eventsForTodayArray.push(event)
            }
        })

        return eventsForTodayArray
    }

    const userID = userInfo[0]?._id

    const patientListActivatedOrDesactivated = userInfo[0]?.asignedPatients?.map((patient: any) => {
        if (patient.readySpecialistList.includes(userID) || patient.desactivatedForSpecialistList.includes(userID)) return
        return patient
    })

    const [selectedCard, setSelectedCard] = useState<
        'patients' | 'events' | 'missingReports' | 'cancelEventsWithoutRecovery'>(userInfo[0]?.role !== 'admin' ? 'patients' : 'events')

    const ActiveCard = {
        'patients': (
            <Suspense>
                <PatientTable
                    patients={patientListActivatedOrDesactivated?.filter(Boolean)}
                />
            </Suspense>
        ),
        'events': (
            <Suspense>
                <EventsTable
                    events={userEvent}
                    userRole={userInfo[0]?.role}
                />
            </Suspense>
        ),
        'missingReports': (
            <Suspense>
                <MissingReportsTable
                    missingReportsWithDate={missingReportsWithDate}
                    refecthFns={refecthFns}
                />
            </Suspense>
        ),
        'cancelEventsWithoutRecovery': (
            <Suspense>
                <ReportsTable reports={userReports} refecthFns={refecthFns} userRole={userInfo[0]?.role} />
            </Suspense>
        )
    }

    const tabsArray = [
        {
            order: userInfo[0]?.role === 'admin' ? 1 : 2,
            roles:["specialist", "admin"],
            tab: <ViewCalendarTab />
        },
        {
            order: userInfo[0]?.role === 'admin' ? 2 : 4,
            roles:["specialist", "admin"],
            tab: <EventsWithoutRecoryTab
                setSelectedCard={setSelectedCard}
                tableContainerRef={tableContainerRef}
                userReports={userReports}
            />
        },
        {
            order: userInfo[0]?.role === 'admin' ? 3 : 3,
            roles:["specialist", "admin"],
            tab: <EventsForTodayTab
                setSelectedCard={setSelectedCard}
                tableContainerRef={tableContainerRef}
                eventForToday={eventForToday}
                userEvent={userEvent}
            />
        },
        {
            order: userInfo[0]?.role === 'admin' ? 4 : 5,
            roles:["specialist", "admin"],
            tab: <MissingReports
                setSelectedCard={setSelectedCard}
                tableContainerRef={tableContainerRef}
                missingReportsWithDate={missingReportsWithDate}
            />
        },
        {
            order: 1,
            roles:["specialist"],
            tab: <MyPatientsTab
                setSelectedCard={setSelectedCard}
                tableContainerRef={tableContainerRef}
                patientListActivatedOrDesactivated={patientListActivatedOrDesactivated}
            />
        },
    ]

    return (
        <>
            <div className="flex items-center mb-4">
                <div className="container px-5 my-4">
                    <div className={userInfo[0]?.role !== 'admin' ? "grid gap-7 sm:grid-cols-2 lg:grid-cols-5" : "grid gap-7 sm:grid-cols-2 lg:grid-cols-4"}>
                        {
                            tabsArray.filter((tab: any) => tab.roles.includes(userInfo[0]?.role)).sort((a,b) => a.order - b.order).map(tabComponent => (
                                tabComponent.tab
                            ))
                        }
                    </div>
                </div>
            </div>
            <div ref={tableContainerRef}>
                {ActiveCard[selectedCard]}
            </div>
        </>
    )
}

export default DashboardTabs