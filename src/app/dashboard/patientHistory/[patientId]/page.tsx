'use client'

import { useParams } from "next/navigation"
import ReportsByPatientTable from "../_components/ReportsByPatientTable"

const PatientHistory = () => {

  const { patientId } = useParams()

  return (
    <div>
      <ReportsByPatientTable patientId={patientId} />
    </div>
  )
}

export default PatientHistory