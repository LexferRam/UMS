'use client'

import { FC } from 'react'
import Icon from '@mui/material/Icon';
import { DocumentMagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { AddPatientModal } from './AddPatientModal'
import { useUserInfo } from '@/hooks'
import { EditPatientModal } from './EditPatientModal'
import moment from 'moment'
import 'moment/locale/es'
import Image from 'next/image'
import { calculateAgeWithMonths } from '@/util/dateOfBirth'
import MaterialTable, { Column } from '@material-table/core';
moment.locale('es');


interface IPerson {
  _id: string;
  name: string;
  lastname: string;
  dateOfBirth: number;
  diagnosis: string;
  historyDescription: string;
  isActive: boolean;
  reports: any,
  specialistAssigned?: any
}

const PatientTable: FC<{
  tableHeaders: string[],
  patients: any,
  refetch?: any
}> = ({ tableHeaders, patients, refetch }) => {

  const router = useRouter()
  const [userInfo] = useUserInfo()

  if (!patients?.length) return (
    <div className='p-5 max-h-[700px] overflow-x-scroll overflow-y-visible sm:overflow-visible scrollbar-hide'>
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

  const columns: Array<Column<IPerson>> = [
    {
      title: "Nombre",
      field: "name",
      render: rowData => (<>{rowData.name + ' ' + rowData.lastname}</>)
    },
    {
      title: "Edad",
      field: "dateOfBirth",
      render: rowData => {
        return (<>
          {moment(rowData.dateOfBirth).format('L')}  <br />
          {`(${calculateAgeWithMonths(rowData.dateOfBirth)?.years} años y ${calculateAgeWithMonths(rowData.dateOfBirth)?.months} meses) `}</>)
      }
    },
    { title: "Diagnóstico", field: "diagnosis" },
    {
      title: "Estatus",
      field: "isActive",
      render: rowData => {
        return (
          <div>
            {rowData.isActive ? (
              <span className="inline-block bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mb-2">
                Activo
              </span>
            ) : (
              <span className="inline-block bg-red-100 rounded-full px-3 py-1 text-sm font-semibold mb-2">
                Desactivo
              </span>
            )}
          </div>
        )
      },
      width: 90,
    },
    {
      title: "Acciones",
      field: "isActive",
      render: ({ _id, name, lastname, dateOfBirth, diagnosis, historyDescription, isActive, reports }) => {

        return (<>
          <div className="flex gap-2 justify-around">
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
                  reportes
                </span>
              </div>
            ) : (
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

            {userInfo[0]?.role === 'admin' && <EditPatientModal refetch={refetch} patient={{ _id, name, lastname, dateOfBirth, diagnosis, historyDescription, isActive }} />}
          </div>
        </>
        )
      },
    }
  ];

  const data: Array<IPerson> = patients?.map(({
    _id,
    name,
    lastname,
    dateOfBirth,
    diagnosis,
    historyDescription,
    isActive,
    reports,
    specialistAssigned
  }: any) => ({
    _id: _id,
    name: name,
    lastname: lastname,
    dateOfBirth: dateOfBirth,
    diagnosis: diagnosis,
    historyDescription: historyDescription,
    isActive: isActive,
    reports: reports,
    specialistAssigned: specialistAssigned
  }))

  const TableMUI = () => (
    <MaterialTable
      columns={columns}
      data={data}
      detailPanel={[
        {
          tooltip: 'Ver motivo de consulta',
          render: ({ rowData }) => {
            return (
              <div key={rowData._id} className='p-5 text-md text-semibold'>
                <div className='mb-2'>
                  <p className='font-bold mb-1'>Motivo de consulta:</p>
                  {rowData.historyDescription}
                </div>
                <p className='font-bold mb-1'>Especialistas asignados:</p>
                <div className="flex flex-row justify-start items-center gap-4 m-2">
                  {rowData.specialistAssigned.map((specialist: any) => {
                    return (
                      <>
                        <div>
                          <Image
                            src={specialist.lastname}
                            className="rounded-full"
                            alt='logo_login'
                            width={48}
                            height={48}
                            priority
                          />
                        </div>
                        <p
                          color="blue-gray"
                          className="font-normal text-clip text-gray-500 text-sm"
                        >
                          {specialist.name}
                        </p>
                      </>
                    )
                  })}
                </div>
              </div>
            )
          },
        }
      ]}
      localization={{
        pagination: {
          labelDisplayedRows: '{from}-{to} de {count}',
          labelRows: 'Filas',
          labelRowsPerPage: '',
          firstTooltip: 'Primera página',
          previousTooltip: 'Página anterior',
          nextTooltip: 'Página siguiente',
          lastTooltip: 'Última página'
        },
        toolbar: {
          searchPlaceholder: 'Buscar',
          searchTooltip: 'Buscar'
        },
        body: {
          deleteTooltip: 'Eliminar',
          editTooltip: 'Editar',
          addTooltip: 'Agregar',
          editRow: {
            cancelTooltip: 'Cancelar',
            saveTooltip: 'Guardar',
            deleteText: '¿Desea eliminar este registro?'
          }
        }
      }}
      options={{
        pageSize: 10,
        showTitle: false,
        headerStyle: {
          backgroundColor: '#E5E5E5',
          textAlign: 'center',
        },
        padding: "dense",
      }}
    />
  );

  return (
    <div className='p-5 max-h-[700px] overflow-x-scroll overflow-y-visible sm:overflow-visible scrollbar-hide'>
      <div className="flex gap-4 items-center mt-4">
        <h3 className='font-semibold text-gray-600 text-xl'>Pacientes:</h3>
        {userInfo[0]?.role === 'admin' && <AddPatientModal refetch={refetch} />}
      </div>
      <div className="h-full w-full overflow-x-scroll overflow-y-visible sm:overflow-visible shadow-md rounded my-8 scrollbar-hide pb-8">
        <TableMUI />
      </div>
    </div>
  )
}

export default PatientTable


