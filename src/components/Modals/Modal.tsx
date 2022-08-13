import {
  Modal as ChakraModal,
  ModalProps as ChakraModalProps,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface ModalProps extends ChakraModalProps {
  title: string;
  children: ReactNode;
}

function Modal({ title, children, ...rest }: ModalProps) {
  return (
    <ChakraModal {...rest} isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader color="black" pr={9}>
          <strong>{title}</strong>

          <ModalCloseButton />
        </ModalHeader>

        {children}
      </ModalContent>
    </ChakraModal>
  );
}

export default Modal;
