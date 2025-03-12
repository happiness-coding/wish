// src/components/Modal/index.tsx
import { FC, ReactNode, useEffect, useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ModalOverlay, ModalContainer, CloseButton } from './styles';
import { IconWrapper } from '../TaskForm/styles';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  showCloseButton?: boolean;
}

export const Modal: FC<ModalProps> = ({
  children,
  onClose,
  showCloseButton = true
}) => {
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [handleEscapeKey]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        {showCloseButton && (
          <CloseButton onClick={onClose}>
            <IconWrapper>
              <XMarkIcon />
            </IconWrapper>
          </CloseButton>
        )}
        {children}
      </ModalContainer>
    </ModalOverlay>
  );
};