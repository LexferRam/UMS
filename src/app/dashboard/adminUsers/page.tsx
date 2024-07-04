'use client'
import AdminUsersTable from './_components/AdminUsersTable';
import { useQuery } from 'react-query';
import AdmiPageSkeleton from '../adminPatients/_components/AdmiPageSkeleton';

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

    return <AdminUsersTable headers={TABLE_HEAD} users={data} refetchUsers={refetch} />
}

export default UsersAdmin