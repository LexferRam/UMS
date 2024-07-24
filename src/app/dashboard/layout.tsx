
import React from 'react'
import '@/styles/globals.css'
import AsideMenuOptions from '@/components/sidebar/AsideMenuOptions'
import { MainNav } from '@/components/sidebar/MainNav'
import SimpleBackdrop from '@/components/ui/Backdrop'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <>
            <MainNav />
            <SimpleBackdrop />
            <div className='sm:w-full sm:mx-auto sm:px-[2rem] flex-1 items-start'>
                <aside className='z-30 -ml-5 hidden w-full'>
                    <AsideMenuOptions />
                </aside>
                <main className='py-6 p-1 sm:px-6 sm:relative'>
                    {children}
                </main>
            </div>
        </>
    )
}
