import { headers } from 'next/headers';
import PatientTable from './_components/PatientTable';

const AdminPatientsPage = async () => {
  const TABLE_HEAD = ["Name", "Email", "Employed", ""];

  const respPatient = await fetch('http://localhost:3000/api/admin/patient', {
    method: "GET",
    headers: headers()
  }
  )
  let patients = await respPatient.json()

  return (
    <PatientTable tableHeaders={TABLE_HEAD} patients={patients}/>
  )
}

export default AdminPatientsPage