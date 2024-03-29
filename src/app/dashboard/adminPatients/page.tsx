'use client'

import AdmiPageSkeleton from './_components/AdmiPageSkeleton';
import PatientTable from './_components/PatientTable';
import { useQuery } from 'react-query';

const AdminPatientsPage = () => {
  const TABLE_HEAD = ["Nombre y apellido", "Fecha de nacimiento", "Diagnóstico", "Motivo de consulta", "Estatus", "Acciones"];

  const { isLoading, error, data: patientList = [], refetch } = useQuery(['patientList'], () =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/patient`).then(res =>
      res.json()
    ))

  const { isLoading: isLoadingUserInfo, error: userInfoError, data: userInfo = [], refetch: refetchUserInfo } = useQuery(['userInfo'], () =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/user`).then(res =>
      res.json()
    ))

  if (userInfoError) return 'Error cargando la información'

  if (isLoadingUserInfo || isLoading) return <AdmiPageSkeleton />

  return (
    <PatientTable
      tableHeaders={TABLE_HEAD}
      patients={userInfo[0]?.role === 'admin' ? patientList : userInfo[0]?.asignedPatients}
      refetch={refetch}
    />
  )
}

export default AdminPatientsPage