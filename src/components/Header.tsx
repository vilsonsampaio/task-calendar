import { AddIcon, CalendarIcon, Search2Icon } from '@chakra-ui/icons';
import { Center, Flex, Heading, HStack, IconButton } from '@chakra-ui/react';

interface HeaderProps {
  onSearchButtonClick: () => unknown;
  onAddButtonClick: () => unknown;
}

function Header({ onAddButtonClick, onSearchButtonClick }: HeaderProps) {
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
        <IconButton
          aria-label="Pesquisar tarefa"
          icon={<Search2Icon />}
          variant="outline"
          colorScheme="purple"
          onClick={onSearchButtonClick}
        />

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
