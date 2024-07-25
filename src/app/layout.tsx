
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import ReactQueryProvider from '@/context/ReactQueryProvider'
import { ThemeProvider } from '@/context/ThemeProvider'
import Providers from '@/context/Providers'
import { LoadingProvider } from '@/context/LoadingProvider'
import { ModalProvider } from '@/context/NotificationDialogProvider'
import ThemeProviderMui from '@/context/ThemeProviderMUI';
import NotiStackProvider from '@/context/NotiStackProvider'

import '@/styles/globals.css'
import "react-datetime/css/react-datetime.css";
import { getSession } from '@/util/authOptions'

const inter = Inter({ subsets: ['latin'] })

const metadata: Metadata = {
  title: 'UMS - La Trinidad',
  description: 'Un Mundo Sensorial - La Trinidad',
  manifest: '/manifest.json',
  icons: {
    apple: '/icon-192x192.png',
  },
  themeColor: '#16b3c4',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getSession()

  return (
    <html lang="es" className='scrollbar-hide'>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-512x512.png" />
        <link rel="icon" href="/icon-512x512.png" sizes="any" />
        <link rel="shortcut icon" href="/icon-512x512.png" type="image/x-icon" />
        <meta name="google" content="notranslate" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body className={inter.className}>
        <Providers session={session}>
          <ReactQueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <LoadingProvider>
                <ModalProvider>
                  <ThemeProviderMui>
                    <NotiStackProvider>
                      {children}
                    </NotiStackProvider>
                  </ThemeProviderMui>
                </ModalProvider>
              </LoadingProvider>
            </ThemeProvider>
          </ReactQueryProvider>
        </Providers>
      </body>
    </html>
  )
}
