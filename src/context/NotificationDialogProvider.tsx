'use client';

import { createContext, ReactNode, useState } from 'react';

interface ModalContextData {
    openModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    setDialogMessage: React.Dispatch<React.SetStateAction<string>>;
    dialogMessage: string;
    handleClickOpen: (e: any) => void;
    handleClose: (e: any) => void;
}

interface ModalProviderProps {
    children: ReactNode
}

export const ModalContext = createContext('') as any

export function ModalProvider({ children }: ModalProviderProps) {

    const [openModal, setOpenModal] = useState(false)
    const [dialogMessage, setDialogMessage] = useState('')
    const [executeCallbackFn, setExecuteCallbackFn] = useState(false)

    function handleClickOpen(e: any) {
        setOpenModal(true)
    }

    async function handleClose(handleAction: any) {
        setOpenModal(false)
        handleAction()
    }

    return (
        <ModalContext.Provider value={{
            openModal,
            setOpenModal,
            setDialogMessage,
            dialogMessage,
            handleClickOpen,
            handleClose,
            setExecuteCallbackFn
        }}>
            {children}
        </ModalContext.Provider>
    )
}