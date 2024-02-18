'use client'

import React, { FC } from 'react'
import {
    Timeline,
    TimelineItem,
    TimelineConnector,
    TimelineHeader,
    TimelineIcon,
    TimelineBody,
    Typography,
    Avatar,
    Card,
} from "@material-tailwind/react";
import moment from 'moment';
import { useQuery } from 'react-query';
import TimelineSkeleton from './TimelineSkeleton';
import 'moment/locale/es'
import { EVENTS_TYPE_COLORS } from '@/util/eventsType';
moment.locale('es');

const PatientHistoryTimeline: FC<{ patientId: string | string[] }> = ({
    patientId
}) => {

    const { isLoading, error, data: patientInfo = [] } = useQuery(['patientInfo', [patientId]], () =>
        fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/reports/reportId?patientId=${patientId}`).then(res =>
            res.json()
        )
    )

    function sortByDateField(data : any, dateFieldName : any = 'createdAt') {
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

    if (error) return <h2>An error has occurred</h2>

    return (
        <>
            <div className='flex gap-2 ml-2 sm:ml-0'>
                <h2 className='font-bold text-gray-600'>
                    Historia médica:
                </h2>
                <b className="capitalize font-light">
                    {patientInfo[0]?.name} {patientInfo[0]?.lastname}
                </b>
            </div>

            <div className='flex gap-2 ml-2 sm:ml-0'>
                <h4 className='font-bold text-gray-600'>
                    Cantidad de reportes:
                </h4>
                <b className="capitalize font-light">
                    {patientInfo[0]?.reports?.length}
                </b>
            </div>

            <div className="w-full flex justify-center mt-4">

                <Card placeholder='' shadow className='rounded-xl p-4 sm:p-10 bg-[#f8fafc] max-h-[76vh] overflow-y-scroll scrollbar-hide'>
                    <Timeline className="w-full sm:w-[60rem] p-2 flex flex-col-reverse">
                        {sortByDateField(patientInfo[0]?.reports)?.map(({ createdBy, description, _id, createdAt, updatedAt, associatedEvent }: any, index: number) => (
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
                                                {/* {createdAt} */}
                                            </span>
                                            <span 
                                                className="ml-2 inline-block rounded-full px-3 py-1 text-[10px] font-light text-white mr-2 mb-2"
                                                style={{
                                                    backgroundColor: EVENTS_TYPE_COLORS[associatedEvent?.eventType]
                                                }}
                                            >
                                                {associatedEvent?.eventType}
                                            </span>
                                        </p>
                                        {/* <Typography color="gary" className="font-extralight text-sm text-gray-600">
                                            Actualizado:{' '}
                                            <span className='font-semibold'>{moment(updatedAt).format('LL')}</span>
                                        </Typography> */}
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