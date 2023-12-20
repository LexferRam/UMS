import { headers } from 'next/headers';
import Image from 'next/image';

const UsersAdmin = async () => {

    const TABLE_HEAD = ["Name", "Email", "Employed", ""];

    // const [users, setUsers] = useState([])

    // useEffect(() => {
    //     const getUsers = async () => {
    //         let respUsers = await fetch('http://localhost:3000/api/admin')
    //         let users = await respUsers.json()
    //         setUsers(users)
    //     }
    //     getUsers()
    // }, [])

    const respUser = await fetch('http://localhost:3000/api/admin', {
        method: "GET",
        headers: headers()
      }
      )
      let users = await respUser.json()

    return (
        <div className='p-5 max-h-[700px] overflow-scroll'>
            <div className="h-full w-full overflow-scroll">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
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
                        {users.map(({ fullname, email, _id, lastname, isActive }: any) => ({ name: fullname, job: email, date: isActive, lastname })).map(({ name, job, date, lastname }: any, index: any) => {
                            const isLast = index === users.length - 1;
                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={date}>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {name}
                                        </p>

                                        <Image
                                            src={lastname}
                                            className="rounded-full"
                                            alt='logo_login'
                                            width={50}
                                            height={50}
                                            priority
                                        />
                                    </td>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {job}
                                        </p>
                                    </td>
                                    <td className={classes}>
                                        {!date ? (
                                            <span className="inline-block bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                                Activo
                                            </span>
                                        ) : (
                                            <span className="inline-block bg-red-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                                Desactivo
                                            </span>
                                        )}

                                    </td>
                                    <td className={classes}>
                                        <p
                                            color="blue-gray"
                                            className="font-medium"
                                        >
                                            Edit
                                        </p>
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

export default UsersAdmin