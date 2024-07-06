'use client'

import { Suspense } from "react"
import { useParams } from "next/navigation"
import dynamic from "next/dynamic"
import TimelineSkeleton from "../_components/TimelineSkeleton"
const PatientHistoryTimeline = dynamic(() => import('../_components/PatientHistoryTimeline'))

const PatientHistory = () => {

  const { patientId } = useParams()

  return (
    <Suspense fallback={<TimelineSkeleton/>}>
      <PatientHistoryTimeline patientId={patientId} />
    </Suspense>
  )
}

export default PatientHistory