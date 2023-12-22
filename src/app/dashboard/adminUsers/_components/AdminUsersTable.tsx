import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { FC } from 'react';

interface AdminUsersTableProps {
    headers: string[];
    users:   any;
}

const AdminUsersTable:FC<AdminUsersTableProps> = ({
    headers,
    users
}) => {
  return (
    <div className='p-5 max-h-[700px] overflow-scroll'>
            <div className="h-full w-full overflow-scroll shadow-md rounded p-2 sm:p-8 ">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {headers.map((head) => (
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
                        {users.map(({ name, email, _id, role, lastname, isActive,speciality }: any, index: number) => {
                            const isLast = index === users.length - 1;
                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={_id}>
                                    <td className={classes}>
                                        <div className="flex flex-col items-center gap-2">
                                            <Image
                                                src={lastname}
                                                className="rounded-full"
                                                alt='logo_login'
                                                width={50}
                                                height={50}
                                                priority
                                            />
                                            <p
                                                color="blue-gray"
                                                className="font-normal text-clip text-gray-500"
                                            >
                                                {name}
                                            </p>
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {email}
                                        </p>
                                    </td>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {role === 'admin' ? (
                                                <span className="inline-block bg-blue-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                                    Administrador
                                                </span>
                                            ) : (
                                                <span className="inline-block bg-orange-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                                    Especialista
                                                </span>
                                            )}
                                        </p>
                                    </td>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {speciality} Terapeuta
                                        </p>
                                    </td>
                                    <td className={classes}>
                                        {isActive ? (
                                            <span className="inline-block bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                                Activo
                                            </span>
                                        ) : (
                                            <span className="inline-block bg-red-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                                Desactivo
                                            </span>
                                        )}

                                    </td>
                                    <td className={classes}>
                                        <Button
                                            variant="outline"
                                            className='bg-blue-100'
                                        >
                                            Editar
                                        </Button>
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

export default AdminUsersTable