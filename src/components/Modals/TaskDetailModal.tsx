/* eslint-disable import/no-duplicates */
import { CalendarIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  HStack,
  ModalBody,
  ModalFooter,
  ModalProps,
  Text,
} from '@chakra-ui/react';
import { addMinutes, format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { CalendarTask } from '../../pages/Home';
import convertTimeDurationInMinutes from '../../utils/convertTimeDurationInMinutes';
import Button from '../Button';
import Modal from './Modal';

type TaskDetailModalProps = Omit<ModalProps, 'children'> & {
  task: CalendarTask;
};

function TaskDetailModal({ isOpen, onClose, task }: TaskDetailModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.title} size="sm">
      <ModalBody pb={6}>
        <HStack
          alignItems="flex-end"
          color="text.secondary"
          borderBottomStyle="solid"
          borderBottomWidth="1px"
          borderBottomColor="border"
          pb={5}
        >
          <CalendarIcon />

          <Text fontSize={14} lineHeight="1">
            {`
                ${format(task.date, 'EEEEEE, dd MMM - HH:mm', {
                  locale: ptBR,
                })} 
                - 
                ${format(
                  addMinutes(
                    task.date,
                    convertTimeDurationInMinutes(task.duration)
                  ),
                  isSameDay(
                    task.date,
                    addMinutes(
                      task.date,
                      convertTimeDurationInMinutes(task.duration)
                    )
                  )
                    ? 'HH:mm'
                    : 'EEEEEE, dd MMM - HH:mm',
                  {
                    locale: ptBR,
                  }
                )}`}
          </Text>
        </HStack>

        <Text color="text.primary" mt={6}>
          {task.description}
        </Text>
      </ModalBody>

      <ModalFooter gap={3}>
        <Button type="submit" variant="solid" leftIcon={<EditIcon />} flex="1">
          Editar
        </Button>

        <Button
          variant="outline"
          onClick={onClose}
          leftIcon={<DeleteIcon />}
          flex="1"
          colorScheme="red"
        >
          Remover
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default TaskDetailModal;
