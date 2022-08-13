/* eslint-disable react/function-component-definition */
import {
  FormControl,
  FormLabel,
  Input as ChakraInput,
  FormErrorMessage,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react';
import React, { forwardRef } from 'react';

interface InputProps extends ChakraInputProps {
  label: string;
  name: string;
  error?: string;
}

const Input: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, error, ...rest },
  ref
) => {
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name} color="text.primary">
        {label}
      </FormLabel>

      <ChakraInput
        {...rest}
        id={name}
        ref={ref}
        name={name}
        color="gray.600"
        boxShadow="sm"
        borderColor="gray.300"
        focusBorderColor="brand"
      />

      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default forwardRef(Input);
