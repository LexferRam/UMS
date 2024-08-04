'use client'

import { Suspense } from 'react';
import AdmiPageSkeleton from './_components/AdmiPageSkeleton';
import PatientTable from './_components/PatientTable';
import { useQuery } from 'react-query';

const AdminPatientsPage = () => {

  const { isLoading, error, data: patientList = [], refetch } = useQuery(['patientList'], async ({ signal }) =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/patient`,{ signal }).then(res =>
      res.json()
    ),
    {
        keepPreviousData: true,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    })

  const { isLoading: isLoadingUserInfo, error: userInfoError, data: userInfo = [], refetch: refetchUserInfo } = useQuery(['userInfo'],async ({ signal }) =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin/user`,{ signal }).then(res =>
      res.json()
    ),
    {
        keepPreviousData: true,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    })

  if (userInfoError) return 'Error por favor recargue la página...'

  if (isLoadingUserInfo || isLoading) return <AdmiPageSkeleton />

  const userID = userInfo[0]._id
  
  const patientListActivatedOrDesactivated = userInfo[0].asignedPatients.map((patient: any) => {
    if (patient.readySpecialistList.includes(userID) || patient.desactivatedForSpecialistList.includes(userID)) return
    return patient
  })
  
  return (
    <Suspense fallback={<AdmiPageSkeleton />}>
      <PatientTable
        patients={
          userInfo[0]?.role === 'admin' ?
            patientList :
            patientListActivatedOrDesactivated.filter(Boolean)
        }
        refetch={refetch}
      />
    </Suspense>
  )
}

export default AdminPatientsPage