/* eslint-disable import/no-duplicates */
import { CalendarIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Center,
  Flex,
  Grid,
  HStack,
  ModalBody,
  ModalFooter,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { addMinutes, format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFormik } from 'formik';
import Kalend, { CalendarView, CalendarEvent } from 'kalend';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Textarea from '../components/Textarea';
import TaskService, { Task } from '../services/TaskService';
import theme from '../styles/theme';
import convertTimeDurationInMinutes from '../utils/convertTimeDurationInMinutes';

import 'kalend/dist/styles/index.css';

export type CalendarTask = CalendarEvent & Omit<Task, 'id'>;

interface AddTaskFormik {
  title: string;
  description: string;
  date: string;
  duration: string;
}

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<CalendarTask[]>([]);

  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null);

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);

  const addTaskFormik = useFormik<AddTaskFormik>({
    initialValues: {
      title: '',
      description: '',
      date: '',
      duration: '',
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required('O campo é obrigatório'),
      description: Yup.string(),
      date: Yup.date()
        .required('O campo é obrigatório')
        .typeError('Selecione uma data'),
      duration: Yup.string()
        .matches(/^\d\d:\d\d$/gm, 'Formato inválido!')
        .required('O campo é obrigatório'),
    }),
    onSubmit: async (values, { resetForm }) => {
      const newTask = await TaskService.createTask({
        title: values.title,
        description: values.description,
        date: parseISO(values.date),
        duration: values.duration,
      });

      const parsedTasks: CalendarTask = {
        id: newTask.id,
        startAt: newTask.date.toISOString(),
        endAt: addMinutes(
          newTask.date,
          convertTimeDurationInMinutes(newTask.duration)
        ).toISOString(),
        timezoneStartAt: 'America/Fortaleza',
        timezoneEndAt: 'America/Fortaleza',
        summary: newTask.title,
        color: theme.colors.brand,

        title: newTask.title,
        date: newTask.date,
        description: newTask.description,
        duration: newTask.duration,
      };

      resetForm();
      setIsAddTaskModalOpen(false);
      setTasks((prevState) => [...prevState, parsedTasks]);
    },
  });

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        const tasksData = await TaskService.listTasks();

        const parsedTasks: CalendarTask[] = tasksData.map((task) => ({
          id: task.id,
          startAt: task.date.toISOString(),
          endAt: addMinutes(
            task.date,
            convertTimeDurationInMinutes(task.duration)
          ).toISOString(),
          timezoneStartAt: 'America/Fortaleza',
          timezoneEndAt: 'America/Fortaleza',
          summary: task.title,
          color: theme.colors.brand,

          title: task.title,
          date: task.date,
          description: task.description,
          duration: task.duration,
        }));

        setTasks(parsedTasks);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  function renderTaskDate(date: Date, duration: string) {
    const formattedStartDate = format(date, 'EEEEEE, dd MMM - HH:mm', {
      locale: ptBR,
    });

    let formattedEndDate;

    const endDate = addMinutes(date, convertTimeDurationInMinutes(duration));
    if (isSameDay(date, endDate)) {
      formattedEndDate = format(endDate, 'HH:mm', { locale: ptBR });
    } else {
      formattedEndDate = format(endDate, 'EEEEEE, dd MMM - HH:mm', {
        locale: ptBR,
      });
    }

    return `${formattedStartDate} - ${formattedEndDate}`;
  }

  if (isLoading) {
    return (
      <Center width="100vw" height="100vh" bg="background">
        <Spinner size="xl" thickness="0.25rem" color="brand" />
      </Center>
    );
  }

  return (
    <>
      <Modal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        title="Adicionar tarefa"
      >
        <form onSubmit={addTaskFormik.handleSubmit}>
          <ModalBody pb={6}>
            <VStack gap={2}>
              <Input
                label="Título"
                name="title"
                placeholder="Título da tarefa"
                value={addTaskFormik.values.title}
                onChange={addTaskFormik.handleChange}
                error={addTaskFormik.errors.title}
              />

              <Textarea
                label="Descrição"
                name="description"
                placeholder="Escreva aqui uma descrição pra tarefa"
                value={addTaskFormik.values.description}
                onChange={addTaskFormik.handleChange}
                error={addTaskFormik.errors.description}
              />

              <Grid templateColumns="1fr 1fr" gap={4}>
                <Input
                  type="datetime-local"
                  label="Data e Hora"
                  name="date"
                  onChange={addTaskFormik.handleChange}
                  error={addTaskFormik.errors.date}
                />

                <Input
                  label="Duração"
                  name="duration"
                  placeholder="hh:mm"
                  value={addTaskFormik.values.duration}
                  onChange={addTaskFormik.handleChange}
                  error={addTaskFormik.errors.duration}
                />
              </Grid>
            </VStack>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button
              type="submit"
              variant="solid"
              isLoading={addTaskFormik.isSubmitting}
            >
              Adicionar
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsAddTaskModalOpen(false)}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {selectedTask !== null && (
        <Modal
          isOpen={isTaskDetailModalOpen}
          onClose={() => setIsTaskDetailModalOpen(false)}
          title={selectedTask.title}
          size="sm"
        >
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
                {renderTaskDate(selectedTask.date, selectedTask.duration)}
              </Text>
            </HStack>

            <Text color="text.primary" mt={6}>
              {selectedTask.description}
            </Text>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button
              type="submit"
              variant="solid"
              leftIcon={<EditIcon />}
              flex="1"
            >
              Editar
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsTaskDetailModalOpen(false)}
              leftIcon={<DeleteIcon />}
              flex="1"
              colorScheme="red"
            >
              Remover
            </Button>
          </ModalFooter>
        </Modal>
      )}

      <Center width="100vw" height="100vh" bg="background">
        <VStack
          width="100%"
          height="100%"
          spacing={10}
          maxW="992px"
          marginX="auto"
          paddingBottom={5}
        >
          <Header
            onAddButtonClick={() => setIsAddTaskModalOpen(true)}
            onSearchButtonClick={() => alert('Pesquisar')}
          />

          <Flex flex="1" width="100%" bg="white" borderRadius={8} padding={5}>
            <Kalend
              colors={{
                light: { primaryColor: theme.colors.brand },
                dark: { primaryColor: theme.colors.brand },
              }}
              events={tasks}
              onEventClick={(event) => {
                setSelectedTask(event as CalendarTask);
                setIsTaskDetailModalOpen(true);
              }}
              initialDate={new Date().toISOString()}
              initialView={CalendarView.WEEK}
              disabledViews={[CalendarView.THREE_DAYS, CalendarView.AGENDA]}
              // selectedView={(e) => console.log(e)}
              // onSelectView={(e) => console.log(e)}
              // onPageChange={(e) => console.log(e)}
              timeFormat="24"
              weekDayStart="Sunday"
              language="ptBR"
              disabledDragging
              hourHeight={60}
            />
          </Flex>
        </VStack>
      </Center>
    </>
  );
}

export default Home;
