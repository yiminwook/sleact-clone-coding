import useStopPropagation from '@hooks/useStopPropagation';
import React, { CSSProperties, MouseEvent, ReactNode } from 'react';
import { CloseModalButton, CreateMenu } from './styles';

interface MenuProps {
  onCloseModal: (e: MouseEvent) => void;
  style?: CSSProperties;
  closeButton?: boolean;
  children?: ReactNode;
}

const Menu = ({ onCloseModal, style, closeButton = true, children }: MenuProps) => {
  const { stopPropagation } = useStopPropagation();

  return (
    <CreateMenu onClick={onCloseModal}>
      <div onClick={stopPropagation} style={style}>
        {closeButton ? <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton> : null}
        {children}
      </div>
    </CreateMenu>
  );
};

export default Menu;
