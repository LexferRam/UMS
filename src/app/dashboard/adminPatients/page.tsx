'use client'

import AdmiPageSkeleton from './_components/AdmiPageSkeleton';
import PatientTable from './_components/PatientTable';
import { useQuery } from 'react-query';

const AdminPatientsPage =  () => {
  const TABLE_HEAD = ["Nombre y apellido", "Fecha de nacimiento - Edad", "Diagnóstico", "Motivo de consulta", "Estatus", "Acciones"];

  const { isLoading, error, data: patientList = [], refetch } = useQuery(['patientList'], () =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/patient`).then(res =>
      res.json()
    ))

  if (isLoading) return <AdmiPageSkeleton />

  return <PatientTable tableHeaders={TABLE_HEAD} patients={patientList} refetch={refetch} />
}

export default AdminPatientsPage