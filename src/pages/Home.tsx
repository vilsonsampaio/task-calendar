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
  useToast,
  VStack,
} from '@chakra-ui/react';
import { addMinutes, format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFormik } from 'formik';
import Kalend, { CalendarView, CalendarEvent, CALENDAR_VIEW } from 'kalend';
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

interface TaskFormik {
  title: string;
  description: string;
  date: string;
  duration: string;
}

function Home() {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<CalendarTask[]>([]);

  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null);

  const isEditing = selectedTask !== null;
  const [isTaskFormModalOpen, setIsTaskFormModalOpen] = useState(false);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  const [isTaskDeleteModalOpen, setIsTaskDeleteModalOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

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

        toast({
          title: 'Não foi possível listar as tarefas!',
          status: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  function handleOpenTaskFormModal() {
    setIsTaskDetailModalOpen(false);
    setIsTaskFormModalOpen(true);
  }

  function handleCloseTaskFormModal() {
    setSelectedTask(null);
    setIsTaskFormModalOpen(false);
  }

  const taskFormik = useFormik<TaskFormik>({
    enableReinitialize: true,
    initialValues: {
      title: selectedTask?.title || '',
      description: selectedTask?.description || '',
      date: selectedTask ? format(selectedTask.date, "yyyy-MM-dd'T'HH:mm") : '',
      duration: selectedTask?.duration || '',
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
      if (isEditing) {
        const updatedTask = await TaskService.updateTask(selectedTask.id, {
          title: values.title,
          description: values.description,
          date: parseISO(values.date),
          duration: values.duration,
        });

        const parsedTask: CalendarTask = {
          id: updatedTask.id,
          startAt: updatedTask.date.toISOString(),
          endAt: addMinutes(
            updatedTask.date,
            convertTimeDurationInMinutes(updatedTask.duration)
          ).toISOString(),
          timezoneStartAt: 'America/Fortaleza',
          timezoneEndAt: 'America/Fortaleza',
          summary: updatedTask.title,
          color: theme.colors.brand,

          title: updatedTask.title,
          date: updatedTask.date,
          description: updatedTask.description,
          duration: updatedTask.duration,
        };

        setTasks((prevState) =>
          prevState.map((task) =>
            task.id === parsedTask.id ? parsedTask : task
          )
        );

        toast({
          title: 'Tarefa editada com sucesso!',
          status: 'success',
        });
      } else {
        const newTask = await TaskService.createTask({
          title: values.title,
          description: values.description,
          date: parseISO(values.date),
          duration: values.duration,
        });

        const parsedTask: CalendarTask = {
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

        setTasks((prevState) => [...prevState, parsedTask]);
        toast({
          title: 'Tarefa criada com sucesso!',
          status: 'success',
        });
      }

      resetForm();
      handleCloseTaskFormModal();
    },
  });

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

  function handleCloseTaskDetailModal() {
    setSelectedTask(null);
    setIsTaskDetailModalOpen(false);
  }

  function handleOpenTaskDeleteModal() {
    setIsTaskDetailModalOpen(false);
    setIsTaskDeleteModalOpen(true);
  }

  function handleCloseTaskDeleteModal() {
    setSelectedTask(null);
    setIsTaskDeleteModalOpen(false);
  }

  async function handleDeleteTask() {
    try {
      if (!selectedTask) throw new Error('You need to select some task');

      setIsDeleting(true);

      const deletedTask = await TaskService.deleteTask(selectedTask.id);

      setTasks((tasks) => tasks.filter((task) => task.id !== deletedTask.id));
      toast({
        title: 'Tarefa removida com sucesso!',
        status: 'success',
      });
    } catch (error) {
      console.error(error);

      toast({
        title: 'Não foi possível remover a tarefa!',
        status: 'error',
      });
    } finally {
      setIsDeleting(false);
      handleCloseTaskDeleteModal();
    }
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
      {selectedTask !== null && (
        <Modal
          isOpen={isTaskDetailModalOpen}
          onClose={() => handleCloseTaskDetailModal()}
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
              variant="solid"
              leftIcon={<EditIcon />}
              flex="1"
              onClick={() => handleOpenTaskFormModal()}
            >
              Editar
            </Button>

            <Button
              variant="outline"
              onClick={() => handleOpenTaskDeleteModal()}
              leftIcon={<DeleteIcon />}
              flex="1"
              colorScheme="red"
            >
              Remover
            </Button>
          </ModalFooter>
        </Modal>
      )}

      <Modal
        isOpen={isTaskFormModalOpen}
        onClose={() => handleCloseTaskFormModal()}
        title={isEditing ? 'Editar tarefa' : 'Adicionar tarefa'}
      >
        <form onSubmit={taskFormik.handleSubmit}>
          <ModalBody pb={6}>
            <VStack gap={2}>
              <Input
                label="Título"
                name="title"
                placeholder="Título da tarefa"
                value={taskFormik.values.title}
                onChange={taskFormik.handleChange}
                error={taskFormik.errors.title}
              />

              <Textarea
                label="Descrição"
                name="description"
                placeholder="Escreva aqui uma descrição pra tarefa"
                value={taskFormik.values.description}
                onChange={taskFormik.handleChange}
                error={taskFormik.errors.description}
              />

              <Grid templateColumns="1fr 1fr" gap={4}>
                <Input
                  type="datetime-local"
                  label="Data e Hora"
                  name="date"
                  value={taskFormik.values.date}
                  onChange={taskFormik.handleChange}
                  error={taskFormik.errors.date}
                />

                <Input
                  label="Duração"
                  name="duration"
                  placeholder="hh:mm"
                  value={taskFormik.values.duration}
                  onChange={taskFormik.handleChange}
                  error={taskFormik.errors.duration}
                />
              </Grid>
            </VStack>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button
              type="submit"
              variant="solid"
              isLoading={taskFormik.isSubmitting}
              loadingText={isEditing ? 'Editando...' : 'Adicionando...'}
            >
              {isEditing ? 'Editar' : 'Adicionar'}
            </Button>

            <Button
              variant="outline"
              onClick={() => handleCloseTaskFormModal()}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {selectedTask !== null && (
        <Modal
          isOpen={isTaskDeleteModalOpen}
          onClose={() => handleCloseTaskDeleteModal()}
          title="Atenção"
          size="sm"
        >
          <ModalBody pb={6}>
            <Text color="text.primary" mt={6}>
              Deseja realmente remover a tarefa selecionada? Após concluída,
              esta ação não poderá ser desfeita.
            </Text>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button
              variant="solid"
              colorScheme="red"
              onClick={() => handleDeleteTask()}
              isLoading={isDeleting}
              loadingText="Removendo..."
            >
              Remover
            </Button>

            <Button
              variant="outline"
              onClick={() => handleCloseTaskDeleteModal()}
            >
              Cancelar
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
            onSearch={(value) => setSearch(value)}
            onAddButtonClick={() => setIsTaskFormModalOpen(true)}
          />

          <Flex flex="1" width="100%" bg="white" borderRadius={8} padding={5}>
            <Kalend
              colors={{
                light: { primaryColor: theme.colors.brand },
                dark: { primaryColor: theme.colors.brand },
              }}
              events={filteredTasks}
              onEventClick={(event) => {
                setSelectedTask(event as CalendarTask);
                setIsTaskDetailModalOpen(true);
              }}
              initialDate={new Date().toISOString()}
              initialView={CalendarView.WEEK}
              disabledViews={[CalendarView.THREE_DAYS, CalendarView.AGENDA]}
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
