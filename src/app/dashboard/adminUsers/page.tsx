'use client'
import dynamic from 'next/dynamic';
import { useQuery } from 'react-query';
import AdmiPageSkeleton from '../adminPatients/_components/AdmiPageSkeleton';
import { Suspense } from 'react';
const AdminUsersTable = dynamic(() => import('./_components/AdminUsersTable'))

const UsersAdmin = () => {

    const TABLE_HEAD = ["Usuario", "Correo electrónico", "Rol", "Especialidad", "Estatus"];

    const { isLoading, error, data = [], refetch } = useQuery(['usersList'], async ({ signal }) =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin`,{ signal }).then(res =>
      res.json()
    ),
    {
        keepPreviousData: true,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    })

    if (isLoading) return <AdmiPageSkeleton />

    console.log(data)

    return (
      <Suspense fallback={<AdmiPageSkeleton />}>
        <AdminUsersTable headers={TABLE_HEAD} users={data} refetchUsers={refetch} />
      </Suspense>
    )
}

export default UsersAdmin