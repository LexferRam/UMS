import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/context/ThemeProvider'
import '@/styles/globals.css'
import Providers from '@/context/Providers'
import "react-datetime/css/react-datetime.css";
import ReactQueryProvider from '@/context/ReactQueryProvider'
import ThemeProviderMui from '@/context/ThemeProviderMUI';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Un Mundo Sensioral',
  description: 'Un Mundo Sensioral',
  manifest: '/manifest.json',
  icons: {
    apple: '/icon-192x192.png',
  },
  themeColor: '#16b3c4',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <ThemeProviderMui>
                {children}
              </ThemeProviderMui>
            </Providers>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
