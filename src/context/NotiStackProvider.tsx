'use client'

import { ReactNode } from "react"
import { SnackbarProvider } from "notistack"

const NotiStackProvider = ({ children }: { children: ReactNode }) => {
    return (
        <SnackbarProvider>{children}</SnackbarProvider>
    )
}

export default NotiStackProvider