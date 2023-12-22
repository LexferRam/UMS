'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

const PatientTable: FC<{ tableHeaders: string[], patients: any }> = ({ tableHeaders, patients }) => {

  const router = useRouter()

  return (
    <div className='p-5 max-h-[700px] overflow-scroll'>
      <h3>Mis pacientes:</h3>
      <div className="h-full w-full overflow-scroll shadow-md rounded p-8">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHeaders.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
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
            {patients?.map(({ name, email, _id, isActive }: any) => ({ name: name, job: email, _id,isActive })).map(({ name, job, _id,isActive }: any, index: any) => {
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
                          <span className="inline-block bg-red-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                            Desactivo
                          </span>
                        )}
                      </p>
                    </p>
                  </td>
                  <td className={classes}>
                    <Button
                      onClick={() => router.push(`/dashboard/patientHistory/${_id}`, { scroll: false })}
                      variant="outline"
                      className='bg-blue-100'
                    >
                      Ver reportes
                    </Button>
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