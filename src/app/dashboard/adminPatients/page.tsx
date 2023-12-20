import { headers } from 'next/headers';
import PatientTable from './_components/PatientTable';

const AdminPatientsPage = async () => {
  const TABLE_HEAD = ["Name", "Email", "Employed", ""];

  const respUser = await fetch('http://localhost:3000/api/admin/patient', {
    method: "GET",
    headers: headers()
  }
  )
  let users = await respUser.json()

  return (
    <PatientTable tableHeaders={TABLE_HEAD} users={users}/>
  )
}

export default AdminPatientsPage