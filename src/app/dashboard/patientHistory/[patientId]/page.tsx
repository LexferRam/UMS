'use client'

import { useParams } from "next/navigation"
import ReportsByPatientTable from "../_components/ReportsByPatientTable"
import PatientHistoryTimeline from "../_components/PatientHistoryTimeline"

const PatientHistory = () => {

  const { patientId } = useParams()

  return (
    <div>
      <PatientHistoryTimeline patientId={patientId} />
    </div>
  )
}

export default PatientHistory