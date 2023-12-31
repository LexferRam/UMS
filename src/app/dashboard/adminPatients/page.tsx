'use client'

import AdmiPageSkeleton from './_components/AdmiPageSkeleton';
import PatientTable from './_components/PatientTable';
import { useQuery } from 'react-query';

const AdminPatientsPage =  () => {
  const TABLE_HEAD = ["Nombre", "Correo", "Estatus", "Acciones"];

  // TODO: 
  const { isLoading, error, data: patientList = [], refetch } = useQuery(['patientList'], () =>
    fetch('http://localhost:3000/api/admin/patient').then(res =>
      res.json()
    ))

  if (isLoading) return <AdmiPageSkeleton />

  return <PatientTable tableHeaders={TABLE_HEAD} patients={patientList} refetch={refetch} />
}

export default AdminPatientsPage