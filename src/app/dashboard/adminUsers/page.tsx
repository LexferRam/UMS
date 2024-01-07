import { headers } from 'next/headers';
import AdminUsersTable from './_components/AdminUsersTable';

const UsersAdmin = async () => {

    const TABLE_HEAD = ["Nombre", "Correo", "Role", "Especialidad", "Estatus"];
    const respUser = await fetch('http://localhost:3000/api/admin', {
        method: "GET",
        headers: headers()
    }
    )
    let users = await respUser.json()

    return <AdminUsersTable headers={TABLE_HEAD} users={users} />
}

export default UsersAdmin