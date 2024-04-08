import { Button } from '@/components/ui/button';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import MaterialTable, { Column } from '@material-table/core';
import Image from 'next/image';
import { FC } from 'react';

interface IPerson {
    _id: string;
    name: string;
    lastname: string;
    email: number;
    isActive: boolean;
    speciality?: any,
    role?: string;
}

interface AdminUsersTableProps {
    headers: string[];
    users: any;
}

const AdminUsersTable: FC<AdminUsersTableProps> = ({
    headers,
    users
}) => {

    if (!users.length) return (
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
    )

    const columns: Array<Column<IPerson>> = [
        {
            title: "Nombre",
            field: "name",
            render: rowData => {
                return (
                    <>
                        <div className="flex justify-start items-center gap-4">
                            <Image
                                src={rowData.lastname}
                                className="rounded-full"
                                alt='logo_login'
                                width={48}
                                height={48}
                                priority
                            />
                            <p
                                color="blue-gray"
                                className="font-normal text-clip text-gray-500"
                            >
                                {rowData.name}
                            </p>
                        </div>
                    </>
                )
            },
            width: 200
        },
        { 
            title: "Correo", 
            field: "email",
            headerStyle: { textAlign: "center" },
            width: 200
        },
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
            headerStyle: { textAlign: "center" },
            width: 150
        },
        {
            title: "Role",
            field: "role;",
            render: rowData => (<>
                <p
                    color="blue-gray"
                    className="font-normal"
                >
                    {rowData.role === 'admin' ? (
                        <span className="inline-block bg-blue-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                            Administrador
                        </span>
                    ) : (
                        <span className="inline-block bg-orange-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                            Especialista
                        </span>
                    )}
                </p></>),
            headerStyle: { textAlign: "center" },
            width: 150
        },
    ];

    const data: Array<IPerson> = users?.map(({
        _id,
        name,
        lastname,
        email,
        isActive,
        speciality,
        role
    }: any) => ({
        _id,
        name,
        lastname,
        email,
        isActive,
        speciality,
        role
    }))

    const TableMUI = () => (
        <MaterialTable
            columns={columns}
            data={data}
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
        <div className='p-5 max-h-[700px] overflow-x-scroll sm:overflow-visible scrollbar-hide'>
            <div className="h-full w-full overflow-x-scroll sm:overflow-visible shadow-md rounded scrollbar-hide">

                <div className="h-full w-full overflow-x-scroll overflow-y-visible sm:overflow-visible shadow-md rounded scrollbar-hide pb-8">
                    <TableMUI />
                </div>
            </div>
        </div>
    )
}

export default AdminUsersTable