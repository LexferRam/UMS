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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className='scrollbar-hide'>
      <meta name="google" content="notranslate"></meta>
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
