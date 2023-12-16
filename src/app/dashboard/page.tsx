'use client'

import { useSession } from "next-auth/react"

const AdminUserPage = () => {
  const { data: session } = useSession()
  return (
    <div>

      <b>Eventos para hoy:</b> 0
      <br />
      <b>Reporte faltantes:</b> 0

      {session?.user && (
        <p>{session.user.name} {session.user.email}</p>
      )}
    </div>
  )
}

export default AdminUserPage