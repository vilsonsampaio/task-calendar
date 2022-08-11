import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: '#735BF3',
  white: '#FFFFFF',
  border: '#F0F0FE',
  black: '#26272B',
  text: {
    primary: '#1E1E49',
    secondary: '#C1C0D0',
  },
  background: '#F9F9FA',
};

const theme = extendTheme({ colors });

export default theme;
