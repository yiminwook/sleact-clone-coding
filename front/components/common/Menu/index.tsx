import useStopPropagation from '@hooks/useStopPropagation';
import React, { CSSProperties, MouseEvent, ReactNode } from 'react';
import { CloseModalButton, CreateMenu } from '@components/common/Menu/styles';

interface MenuProps {
  show: boolean;
  onCloseMenu: (e: MouseEvent) => void;
  style?: CSSProperties;
  closeButton?: boolean;
  children?: ReactNode;
}

const Menu = ({ show, onCloseMenu: onCloseModal, style, closeButton = true, children }: MenuProps) => {
  const { stopPropagation } = useStopPropagation();

  if (!show) return null;

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
