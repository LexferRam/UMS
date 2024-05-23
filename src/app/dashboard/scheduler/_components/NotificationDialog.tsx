'use client'

import React, { FC, useContext } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ModalContext } from '@/context/NotificationDialogProvider';

import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';

interface NotificationDialogProps {
    open: boolean,
    dialogMessage: string,
    handleClickOpen: (e: any) => void,
    handleClose: (e: any) => void
}

const NotificationDialog: FC<any> = ({
    // openModal,
    // setDialogMessage,
    // dialogMessage,
    // handleClickOpen,
    // handleClose
    handleDeleteAction
}) => {

    const { openModal,
        setOpenModal,
        setDialogMessage,
        dialogMessage,
        handleClickOpen,
        handleClose,
        setExecuteCallbackFn } = useContext(ModalContext) as any

        

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
            {/* <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {dialogMessage}
                </DialogContentText>
            </DialogContent> */}
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
