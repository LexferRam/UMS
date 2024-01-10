'use client'
import AdminUsersTable from './_components/AdminUsersTable';
import { useQuery } from 'react-query';
import AdmiPageSkeleton from '../adminPatients/_components/AdmiPageSkeleton';

const UsersAdmin = () => {

    const TABLE_HEAD = ["Nombre", "Correo", "Role", "Especialidad", "Estatus"];

    const { isLoading, error, data = [], refetch } = useQuery(['usersList'], () =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/admin`).then(res =>
      res.json()
    ))

    if (isLoading) return <AdmiPageSkeleton />

    return <AdminUsersTable headers={TABLE_HEAD} users={data} />
}

export default UsersAdmin