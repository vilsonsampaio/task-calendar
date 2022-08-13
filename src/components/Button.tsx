/* eslint-disable react/function-component-definition */
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';
import React, { forwardRef } from 'react';

type ButtonProps = ChakraButtonProps;

const Button: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { children, ...rest },
  ref
) => {
  return (
    <ChakraButton ref={ref} colorScheme="purple" {...rest}>
      {children}
    </ChakraButton>
  );
};

export default forwardRef(Button);
