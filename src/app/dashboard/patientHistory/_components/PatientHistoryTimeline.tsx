'use client'

import React, { FC, useState } from 'react'
import {
    Timeline,
    TimelineItem,
    TimelineConnector,
    TimelineHeader,
    TimelineIcon,
    TimelineBody,
    Avatar,
    Card,
} from "@material-tailwind/react";
import moment from 'moment';
import { useQuery } from 'react-query';
import TimelineSkeleton from './TimelineSkeleton';
import 'moment/locale/es'
import { EVENTS_TYPE_COLORS } from '@/util/eventsType';
import { ChipWithAvatar } from './AvatarChip';
moment.locale('es');

const PatientHistoryTimeline: FC<{ patientId: string | string[] }> = ({
    patientId
}) => {

    const [therapistSelected, setTherapistSelected] = useState('')

    const { isLoading, error, data: patientInfo = [] } = useQuery(['patientInfo', [patientId]], () =>
        fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/reports/reportId?patientId=${patientId}`).then(res =>
            res.json()
        )
    )

    let therapistList: any = [...new Set(patientInfo[0]?.reports.map((report: any) => report.createdBy))].reduce((acc: any, objeto: any) => {
        if (!acc.some((otroObjeto: any) => otroObjeto.name === objeto.name)) {
            acc.push(objeto);
        }
        return acc;
    }, [])

    function sortByDateField(data: any, dateFieldName: any = 'createdAt') {
        return data?.sort((a: any, b: any) => {
            const dateA = a[dateFieldName];
            const dateB = b[dateFieldName];

            if (dateA < dateB) {
                return -1; // Descending order (recent to oldest)
            } else if (dateA > dateB) {
                return 1; // Ascending order (oldest to recent)
            } else {
                return 0; // Equal dates
            }
        });
    }

    if (isLoading) return (
        <div className='mt-4'>
            <h3>
                <div
                    className="mb-2 h-2 w-72 rounded-full bg-gray-300"
                >
                    &nbsp;
                </div>
            </h3>
            <h3>
                <div
                    className="mb-2 h-2 w-48 rounded-full bg-gray-300"
                >
                    &nbsp;
                </div>
            </h3>
            <div className="w-full flex justify-center mt-6">
                <Card placeholder='' shadow className='w-full sm:w-[60rem] rounded-xl p-4 sm:p-10 bg-[#f8fafc] max-h-[76vh] overflow-y-scroll scrollbar-hide'>
                    <TimelineSkeleton />
                    <TimelineSkeleton />
                    <TimelineSkeleton />
                </Card>
            </div>
        </div>
    )

    if (error) return <h2>Error, por favor recargue nuevamente</h2>

    return (
        <>
            <div className='flex gap-2 ml-2 mt-2 sm:ml-0'>
                <h2 className='font-bold text-gray-600'>
                    Historia médica:
                </h2>
                <b className="capitalize font-light">
                    {patientInfo[0]?.name} {patientInfo[0]?.lastname}
                </b>
            </div>

            <div className='flex flex-col sm:flex-row gap-2 ml-2 mt-2 sm:ml-0'>
                <h4 className='font-bold text-gray-600'>
                    Terapeutas:
                </h4>
                <div className='flex gap-4 flex-wrap'>
                    <div  onClick={() => setTherapistSelected('')}>
                        <ChipWithAvatar
                            name='Todos'
                            profilePicture=''
                            therapistSelected={therapistList?.filter((therapist: any) => therapist._id === therapistSelected)[0]?.name || 'Todos'}
                        />
                    </div>
                    {
                        therapistList.map((therapist: any) => (
                            <div key={therapist._id} onClick={() => setTherapistSelected(therapist._id)}>
                                <ChipWithAvatar
                                    name={therapist.name}
                                    profilePicture={therapist.lastname}
                                    therapistSelected={therapistList.filter((therapist: any) => therapist._id === therapistSelected)[0]?.name}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-2 ml-2 mt-2 sm:ml-0'>
                <h4 className='font-bold text-gray-600'>
                    Reportes: {
                        sortByDateField(
                            therapistSelected === '' ?
                                patientInfo[0]?.reports :
                                patientInfo[0]?.reports.filter((item: any) => item.createdBy._id === therapistSelected)
                        )?.length
                    }
                </h4>
            </div>

            <div className="w-full flex justify-center mt-4">
                <Card placeholder='' shadow className='rounded-xl p-4 sm:p-10 bg-[#f8fafc] max-h-[76vh] overflow-y-scroll scrollbar-hide'>
                    <Timeline className="w-full sm:w-[60rem] p-2 flex flex-col-reverse">
                        {sortByDateField(
                            therapistSelected === '' ?
                                patientInfo[0]?.reports :
                                patientInfo[0]?.reports.filter((item: any) => item.createdBy._id === therapistSelected)
                        )?.map(({ createdBy, description, _id, createdAt, isForEventCancel, associatedEvent }: any, index: number) => (
                            <TimelineItem key={_id}>

                                {index > 0 && (
                                    <TimelineConnector  >
                                        <span className="w-0.5 h-full bg-gray-200"></span>
                                    </TimelineConnector>
                                )}

                                <TimelineHeader>
                                    <TimelineIcon className="p-0">
                                        <Avatar placeholder='' size="md" src={createdBy?.lastname} alt={createdBy?.name} withBorder />
                                    </TimelineIcon>
                                    <div className="flex flex-col">
                                        <div color="blue-gray">
                                            {createdBy?.name}
                                        </div>
                                        <p className="font-extralight text-sm text-gray-600">
                                            <span className='font-light'>
                                                {moment(createdAt).format('LL')}
                                            </span>
                                            <span
                                                className="ml-2 inline-block rounded-full px-3 py-1 text-[10px] font-light text-white mr-2 mb-2"
                                                style={{
                                                    backgroundColor: EVENTS_TYPE_COLORS[associatedEvent?.eventType]
                                                }}
                                            >
                                                {associatedEvent?.eventType}
                                            </span>

                                            {isForEventCancel && (
                                                <span
                                                    className="ml-2 inline-block rounded-full px-3 py-1 text-[10px] font-light text-white mr-2 mb-2"
                                                    style={{
                                                        backgroundColor: '#e64451'
                                                    }}
                                                >
                                                    Cita cancelada
                                                </span>
                                            )}

                                        </p>
                                    </div>
                                </TimelineHeader>

                                <TimelineBody className="pb-8">
                                    <p color="gary" className="font-normal text-gray-600 italic ml-4">
                                        {description}
                                    </p>
                                </TimelineBody>

                            </TimelineItem>
                        ))}
                    </Timeline>

                </Card>
            </div>
        </>
    )
}

export default PatientHistoryTimeline