'use client'

import { FC, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

interface ReactQueryProviderProps {
  children: ReactNode
}

const queryClient = new QueryClient()

const ReactQueryProvider: FC<ReactQueryProviderProps> = ({
  children
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default ReactQueryProvider