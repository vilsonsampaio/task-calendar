import {
  Modal as ChackraModal,
  ModalProps as ChackraModalProps,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface ModalProps extends ChackraModalProps {
  title: string;
  children: ReactNode;
}

function Modal({ title, children, ...rest }: ModalProps) {
  return (
    <ChackraModal {...rest} isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />

        {children}
      </ModalContent>
    </ChackraModal>
  );
}

export default Modal;
