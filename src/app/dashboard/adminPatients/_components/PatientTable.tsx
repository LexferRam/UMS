'use client'

import { FC } from 'react'
import { DocumentMagnifyingGlassIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { AddPatientModal } from './AddPatientModal'
import { useUserInfo } from '@/hooks'

const PatientTable: FC<{ tableHeaders: string[], patients: any, refetch: any }> = ({ tableHeaders, patients, refetch }) => {

  const router = useRouter()
  const [userInfo] = useUserInfo()

  console.log(userInfo)

  return (
    <div className='p-5 max-h-[700px] overflow-scroll'>
      <div className="flex gap-4 items-center mt-4">
        <h3 className='font-semibold text-gray-600 text-xl'>Mis pacientes:</h3>
        {userInfo[0]?.role === 'admin' && <AddPatientModal refetch={refetch} />}
      </div>
      <div className="h-full w-full overflow-scroll shadow-md rounded p-8">
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
            {patients?.map(({ name, email, _id, isActive }: any) => ({ name: name, job: email, _id, isActive })).map(({ name, job, _id, isActive }: any, index: any) => {
              const isLast = index === patients.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={_id}>
                  <td className={classes}>
                    <p
                      color="blue-gray"
                      className="font-normal"
                    >
                      {name}
                    </p>
                  </td>
                  <td className={classes}>
                    <p
                      color="blue-gray"
                      className="font-normal"
                    >
                      {job}
                    </p>
                  </td>
                  <td className={classes}>
                    <p
                      color="blue-gray"
                      className="font-normal"
                    >
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
                    </p>
                  </td>
                  <td className={classes}>
                    {/* <Button
                      onClick={() => router.push(`/dashboard/patientHistory/${_id}`, { scroll: false })}
                      variant="outline"
                      className='bg-blue-100'
                    >
                      Ver reportes
                    </Button> */}
                    <div className="flex gap-4">
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

                      {userInfo[0]?.role === 'admin' &&
                        (
                          <div
                            onClick={() => alert('Editar paciente')}
                            className="flex gap-1 cursor-pointer items-center"
                          >
                            <PencilSquareIcon
                              className="h-6 w-6 text-green-500"
                            />
                            <span
                              className='text-sm font-semibold text-gray-600'
                            >
                              Editar
                            </span>
                          </div>
                        )}
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