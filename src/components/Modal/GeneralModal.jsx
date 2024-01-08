import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import React from 'react';
import { useModal } from '../../Context/ModalContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function GeneralModal() {
  const { isOpen, modalContent, closeModal } = useModal();

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <CloseIcon
          sx={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            cursor: 'pointer',
          }}
          onClick={closeModal}
        />
        {modalContent}
      </Box>
    </Modal>
  );
}
