'use client'

import { createContext, useState } from 'react'

export const LoadingContext = createContext('') as any

export const LoadingProvider = ({ children }: any) => {

    const [loading, setLoading] = useState(false)

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}
