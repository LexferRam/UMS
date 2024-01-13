
import React from 'react'
import '@/styles/globals.css'
import AsideMenuOptions from '@/components/sidebar/AsideMenuOptions'
import { MainNav } from '@/components/sidebar/MainNav'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <>
            <MainNav/>
            <div className='sm:w-full sm:mx-auto sm:px-[2rem] flex-1 items-start md:grid md:grid-cols-[180px_minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)] md:gap-4'>
                <aside className='z-30 -ml-5 hidden w-full md:block'>
                    <AsideMenuOptions />
                </aside>
                <main className='py-6 p-1 sm:px-6 sm:relative sm:top-[80px]'>
                    {children}
                </main>
            </div>
        </>
    )
}
