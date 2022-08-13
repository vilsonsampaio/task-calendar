/* eslint-disable react/function-component-definition */
import {
  FormControl,
  FormLabel,
  Input as ChackraInput,
  FormErrorMessage,
  InputProps as ChackraInputProps,
} from '@chakra-ui/react';
import React, { forwardRef } from 'react';

interface InputProps extends ChackraInputProps {
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

      <ChackraInput
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
