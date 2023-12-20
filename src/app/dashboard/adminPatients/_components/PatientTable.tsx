'use client'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

const PatientTable:FC<{ tableHeaders: string[], users: any}> = ({tableHeaders, users}) => {

  const router = useRouter()
  
  return (
    <div className='p-5 max-h-[700px] overflow-scroll'>
      <h3>Mis pacientes:</h3>
      <div className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHeaders.map((head) => (
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
            {users?.map(({ name, email, _id, lastname }: any) => ({ name: name, job: email, date: _id, lastname })).map(({ name, job, date, lastname }: any, index: any) => {
              const isLast = index === users.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={date}>
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
                      {date}
                    </p>
                  </td>
                  <td className={classes}>
                    <p
                      color="blue-gray"
                      className="font-medium cursor-pointer"
                      onClick={() => router.push('/dashboard/userHistory', { scroll: false })}
                    >
                      ver reportes(historial)
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

export default PatientTable