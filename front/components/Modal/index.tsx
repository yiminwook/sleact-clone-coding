import { CloseModalButton } from '@components/Menu/styles';
import useStopPropagation from '@hooks/useStopPropagation';
import React, { ReactNode } from 'react';
import { CreateModal } from '@components/Modal/styles';

interface ModalProps {
  show: boolean;
  onCloseModal: (close: true) => void;
  children: ReactNode;
}

const Modal = ({ show, children, onCloseModal }: ModalProps) => {
  const { stopPropagation } = useStopPropagation();
  if (show === false) {
    return null;
  }

  return (
    <CreateModal onClick={() => onCloseModal(true)}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={() => onCloseModal(true)}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
};

export default Modal;
