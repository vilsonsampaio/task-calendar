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
  background: '#F4F5F5',
};

const fonts = {
  heading: `'Fira Sans', sans-serif`,
  body: `'Fira Sans', sans-serif`,
};

const theme = extendTheme({
  fonts,
  colors,
});

export default theme;
