'use client'
import moment from "moment";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

const ReportsByPatientTable: FC<{ patientId: string | string[] }> = ({ patientId }) => {

    const [reports, setReports] = useState([])
    const [patient, setPatient] = useState<any>()

    useEffect(() => {

        const getPatientReports = async () => {
            const respReports = await fetch(`http://localhost:3000/api/admin/reports/reportId?patientId=${patientId}`)
            let reports = await respReports.json()
            setReports(reports[0]?.reports)
            setPatient(reports[0])
        }
        getPatientReports()

    }, [])


    return (
        <div className='p-5 max-h-[700px] overflow-scroll'>
            <h3>Historia médica: <b className="capitalize">{patient?.name} {patient?.lastname}</b></h3>
            <div className="h-full w-full overflow-scroll">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {["Creado Por", "descripcion", "Fecha de creación", ""].map((head) => (
                                <th
                                    key={head}
                                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                >
                                    <p
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {head}
                                    </p>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {reports?.map(({ createdBy, description, _id, createdAt }: any) => ({ createdBy, description, _id,createdAt })).map(({ createdBy, description, _id,createdAt }: any, index: any) => {
                            const isLast = index === reports.length - 1;
                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={_id}>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal flex gap-2 items-center"
                                        >
                                            <Image src={createdBy?.lastname || ''} alt='' height={50} width={50} className='rounded-full cursor-pointer' />
                                            {createdBy.name}
                                        </p>
                                    </td>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {description}
                                        </p>
                                    </td>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {moment(createdAt).format('LLLL')}
                                        </p>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ReportsByPatientTable