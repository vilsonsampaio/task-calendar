import { ChakraProvider } from '@chakra-ui/react';

import Home from './pages/Home';
import theme from './styles/theme';

import '@fontsource/fira-sans/400.css';
import '@fontsource/fira-sans/600.css';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Home />
    </ChakraProvider>
  );
}

export default App;
