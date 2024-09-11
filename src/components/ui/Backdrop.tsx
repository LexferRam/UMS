'use client'

import { useContext, useState } from 'react';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { LoadingContext } from '@/context/LoadingProvider';

export default function SimpleBackdrop() {

  const { loading, setLoading } = useContext(LoadingContext) as any

  const handleClose = () => {
    setLoading(false);
  };
  const handleOpen = () => {
    setLoading(true);
  };

  return (
      <Backdrop
        sx={{ color: '#fff', zIndex: 99999999 }}
        open={loading}
        onClick={handleClose}
      >
        <CircularProgress  sx={{ zIndex: 99999999 }} color="inherit" />
      </Backdrop>
  );
}