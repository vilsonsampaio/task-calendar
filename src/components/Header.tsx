import { AddIcon, CalendarIcon, Search2Icon } from '@chakra-ui/icons';
import {
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import useDebounce from '../hooks/useDebounce';

interface HeaderProps {
  onSearch: (search: string) => unknown;
  onAddButtonClick: () => unknown;
}

function Header({ onAddButtonClick, onSearch }: HeaderProps) {
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <Flex
      as="header"
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      borderBottomWidth={2}
      borderBottomColor="border"
      height="5.5rem"
    >
      <HStack spacing={4}>
        <Center width={10} height={10} backgroundColor="white" borderRadius={8}>
          <CalendarIcon color="text.primary" />
        </Center>

        <Heading size="md">Task Calendar</Heading>
      </HStack>

      <HStack spacing={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Search2Icon color="brand" />
          </InputLeftElement>

          <Input
            placeholder="Pesquisar tarefa..."
            color="gray.600"
            boxShadow="sm"
            borderColor="gray.300"
            focusBorderColor="brand"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>

        <IconButton
          aria-label="Adicionar tarefa"
          icon={<AddIcon />}
          variant="solid"
          colorScheme="purple"
          onClick={onAddButtonClick}
        />
      </HStack>
    </Flex>
  );
}

export default Header;
