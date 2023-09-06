import React from 'react'

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import useWindowDimensions from '../hooks/useWindowDimensions';

export default function CustomModal({ open, handleClose, children }) {

    const { width } = useWindowDimensions();

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        minWidth: width > 1000 ? '40%' : '99%',
        maxHeight: "80%",
        overflow: "scroll",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 2,
        borderRadius: "10px",
        zIndex: 49
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {children}
            </Box>
        </Modal>
    )
}