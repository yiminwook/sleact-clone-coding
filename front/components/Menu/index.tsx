import React, { CSSProperties, MouseEvent, ReactNode, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from './styles';

interface MenuProps {
  onCloseModal: (e: MouseEvent) => void;
  style?: CSSProperties;
  closeButton?: boolean;
  children?: ReactNode;
}

const Menu = ({ onCloseModal, style, closeButton = true, children }: MenuProps) => {
  const stopPropagation = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  return (
    <CreateMenu>
      <div onClick={stopPropagation} style={style}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};

export default Menu;
