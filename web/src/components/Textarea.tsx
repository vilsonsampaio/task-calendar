/* eslint-disable react/function-component-definition */
import {
  FormControl,
  FormLabel,
  Textarea as ChakraTextarea,
  FormErrorMessage,
  TextareaProps as ChakraTextareaProps,
} from '@chakra-ui/react';
import React, { forwardRef } from 'react';

interface TextareaProps extends ChakraTextareaProps {
  label: string;
  name: string;
  error?: string;
}

const Textarea: React.ForwardRefRenderFunction<
  HTMLTextAreaElement,
  TextareaProps
> = ({ name, label, error, ...rest }, ref) => {
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name} color="text.primary">
        {label}
      </FormLabel>

      <ChakraTextarea
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

export default forwardRef(Textarea);
