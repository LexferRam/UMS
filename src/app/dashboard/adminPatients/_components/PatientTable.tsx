'use client'

import { FC } from 'react'
import { DocumentMagnifyingGlassIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { AddPatientModal } from './AddPatientModal'
import { useUserInfo } from '@/hooks'
import { EditPatientModal } from './EditPatientModal'
import moment from 'moment'
import 'moment/locale/es'
import Image from 'next/image'
import { calculateAgeWithMonths } from '@/util/dateOfBirth'
moment.locale('es');

const PatientTable: FC<{ 
  tableHeaders: string[], 
  patients:     any,
  refetch?:  any
}> = ({ tableHeaders, patients, refetch }) => {

  const router = useRouter()
  const [userInfo] = useUserInfo()

  if (!patients?.length) return (
    <div className='p-5 max-h-[700px] overflow-scroll sm:overflow-visible scrollbar-hide'>
      <div className="flex gap-4 items-center mt-4">
        <h3 className='font-semibold text-gray-600 text-xl'>Pacientes:</h3>
        {userInfo[0]?.role === 'admin' && <AddPatientModal refetch={refetch} />}
      </div>
      <div className='w-full h-full flex items-center justify-center mt-16'>
        <Image
          src='/nodata.png'
          alt='logo_login'
          width={150}
          height={150}
          priority
        />
        <p className='text-sm font-semibold text-gray-600'>Sin datos que mostrar</p>
      </div>
    </div>
  )

  return (
    <div className='p-5 max-h-[700px] overflow-scroll sm:overflow-visible scrollbar-hide'>
      <div className="flex gap-4 items-center mt-4">
        <h3 className='font-semibold text-gray-600 text-xl'>Pacientes:</h3>
        {userInfo[0]?.role === 'admin' && <AddPatientModal refetch={refetch}/>}
      </div>
      <div className="h-full w-full overflow-scroll sm:overflow-visible shadow-md rounded mt-8 scrollbar-hide">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHeaders.map((head, index) => (
                <th
                  key={index}
                  className="border-b border-blue-gray-100 bg-[#f8fafc] p-4"
                >
                  <span
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patients?.map(({_id, name, lastname, dateOfBirth, diagnosis, historyDescription, isActive, reports}: any, index: any) => {
              const isLast = index === patients.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
              // if(!isActive && userInfo[0]?.role !== 'admin' ) return

              return (
                <tr key={_id} className="hover:bg-[#f8fafc]">
                  <td className={classes}>
                    <p
                      color="blue-gray"
                      className="font-normal"
                    >
                      {name + ' ' + lastname}
                    </p>
                  </td>
                  <td className={classes}>
                    <p
                      color="blue-gray"
                      className="font-normal max-w-[100px]"
                    >
                      {moment(dateOfBirth).format('L')} <br/>
                      {`(${calculateAgeWithMonths(dateOfBirth)?.years} años y ${calculateAgeWithMonths(dateOfBirth)?.months} meses) `}
                      </p>
                  </td>
                  <td className={classes}>
                    <p
                      color="blue-gray"
                      className="font-normal max-w-[100px]"
                    >
                      {diagnosis}
                    </p>
                  </td>
                  <td className={classes}>
                    <p
                      color="blue-gray"
                      className="font-normal max-w-[200px]"
                    >
                      {historyDescription}
                    </p>
                  </td>
                  <td className={classes}>
                    <p
                      color="blue-gray"
                      className="font-normal"
                    >
                        {isActive ? (
                          <span className="inline-block bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                            Activo
                          </span>
                        ) : (
                          <span className="inline-block bg-red-100 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                            Desactivo
                          </span>
                        )}
                    </p>
                  </td>
                  <td className={classes}>
                    <div className="flex gap-4">

                    {reports?.length > 0 ? (
                      <div
                        onClick={() => router.push(`/dashboard/patientHistory/${_id}`, { scroll: false })}
                        className="flex gap-1 cursor-pointer items-center"
                      >
                        <DocumentMagnifyingGlassIcon
                          className="h-6 w-6 text-blue-500"
                        />
                        <span
                          className='text-sm font-semibold text-gray-600'
                        >
                          Ver reportes
                        </span>
                      </div>
                    ): (
                      <div
                      className="flex gap-1 items-center"
                    >
                      <XMarkIcon className="h-6 w-6 text-red-500" />
                      <span
                        className='text-sm font-semibold text-gray-600'
                      >
                        Sin reportes
                      </span>
                    </div>
                    )}
                      
                      
                      {userInfo[0]?.role === 'admin' && <EditPatientModal refetch={refetch} patient={{_id, name, lastname, dateOfBirth, diagnosis, historyDescription, isActive}}/>}
                    </div>

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

export default PatientTable