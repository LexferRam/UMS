'use client'

import React, { FC, useContext } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { ModalContext } from '@/context/NotificationDialogProvider';

interface NotificationDialogProps {
    open: boolean,
    dialogMessage: string,
    handleClickOpen: (e: any) => void,
    handleClose: (e: any) => void
}

const NotificationDialog: FC<any> = ({
    handleDeleteAction
}) => {

    const { openModal, setOpenModal, dialogMessage, handleClose } = useContext(ModalContext) as any

    return (
        <Dialog
            open={openModal ?? false}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            style={{ zIndex: 99999999999999 }}
        >
            <DialogTitle style={{ fontSize: '18px' }}>
                {dialogMessage}
            </DialogTitle>

            <DialogActions>
                <Button
                    size="small"
                    style={{ fontSize: '15px', textTransform: 'capitalize' }}
                    onClick={() => setOpenModal(false)}
                >
                    Cancelar
                </Button>

                <Button
                    size="small"
                    style={{ fontSize: '15px', textTransform: 'capitalize' }}
                    color="error"
                    onClick={() => {
                        handleDeleteAction()
                        setOpenModal(false)
                    }}
                    autoFocus
                >
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default NotificationDialog
