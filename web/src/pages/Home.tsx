/* eslint-disable import/no-duplicates */
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
  EditIcon,
} from '@chakra-ui/icons';
import {
  ButtonGroup,
  Center,
  Flex,
  Grid,
  HStack,
  IconButton,
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
import { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';

import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Textarea from '../components/Textarea';
import TaskService from '../services/TaskService';
import theme from '../styles/theme';
import convertMinutesInTimeDuration from '../utils/convertMinutesInTimeDuration';
import convertTimeDurationInMinutes from '../utils/convertTimeDurationInMinutes';

import 'kalend/dist/styles/index.css';

export interface CalendarTask extends CalendarEvent {
  title: string;
  description: string;
  date: Date;
  duration: string;
}

interface TaskFormik {
  title: string;
  description: string;
  date: string;
  duration: string;
}

function Home() {
  const toast = useToast();

  const kalendRef: any = useRef();

  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<CalendarTask[]>([]);

  const [search, setSearch] = useState('');
  const [selectedView, setSelectedView] = useState<CALENDAR_VIEW>(
    CalendarView.WEEK
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

        const { data } = await TaskService.listTasks();

        const parsedTasks: CalendarTask[] = data.map((task) => ({
          id: task.id,
          startAt: parseISO(task.date).toISOString(),
          endAt: addMinutes(parseISO(task.date), task.duration).toISOString(),
          timezoneStartAt: 'America/Fortaleza',
          timezoneEndAt: 'America/Fortaleza',
          summary: task.title,
          color: theme.colors.brand,

          title: task.title,
          date: parseISO(task.date),
          description: task.description,
          duration: convertMinutesInTimeDuration(task.duration),
        }));

        setTasks(parsedTasks);
      } catch (error) {
        console.error(error);

        toast({
          title: 'N??o foi poss??vel listar as tarefas!',
          status: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  function handleCalendarStateChange(state: any) {
    setSelectedDate(parseISO(state.selectedDate));
  }

  function handleCalendarGoForward() {
    kalendRef?.current?.navigateForward();
  }

  function handleCalendarGoBack() {
    kalendRef?.current?.navigateBackwards();
  }

  function handleCalendarGoToday() {
    kalendRef?.current?.navigateToTodayDate();
  }

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
      title: Yup.string().required('O campo ?? obrigat??rio'),
      description: Yup.string(),
      date: Yup.date()
        .required('O campo ?? obrigat??rio')
        .typeError('Selecione uma data'),
      duration: Yup.string()
        .matches(/^\d\d:\d\d$/gm, 'Formato inv??lido!')
        .required('O campo ?? obrigat??rio'),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (isEditing) {
        const { data: updatedTask } = await TaskService.updateTask(
          selectedTask.id,
          {
            title: values.title,
            description: values.description,
            date: parseISO(values.date),
            duration: values.duration,
          }
        );

        const parsedTask: CalendarTask = {
          id: updatedTask.id,
          startAt: parseISO(updatedTask.date).toISOString(),
          endAt: addMinutes(
            parseISO(updatedTask.date),
            updatedTask.duration
          ).toISOString(),
          timezoneStartAt: 'America/Fortaleza',
          timezoneEndAt: 'America/Fortaleza',
          summary: updatedTask.title,
          color: theme.colors.brand,

          title: updatedTask.title,
          date: parseISO(updatedTask.date),
          description: updatedTask.description,
          duration: convertMinutesInTimeDuration(updatedTask.duration),
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
        const { data: newTask } = await TaskService.createTask({
          title: values.title,
          description: values.description,
          date: parseISO(values.date),
          duration: values.duration,
        });

        const parsedTask: CalendarTask = {
          id: newTask.id,
          startAt: parseISO(newTask.date).toISOString(),
          endAt: addMinutes(
            parseISO(newTask.date),
            newTask.duration
          ).toISOString(),
          timezoneStartAt: 'America/Fortaleza',
          timezoneEndAt: 'America/Fortaleza',
          summary: newTask.title,
          color: theme.colors.brand,

          title: newTask.title,
          date: parseISO(newTask.date),
          description: newTask.description,
          duration: convertMinutesInTimeDuration(newTask.duration),
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

      await TaskService.deleteTask(selectedTask.id);

      setTasks((tasks) => tasks.filter((task) => task.id !== selectedTask.id));
      toast({
        title: 'Tarefa removida com sucesso!',
        status: 'success',
      });
    } catch (error) {
      console.error(error);

      toast({
        title: 'N??o foi poss??vel remover a tarefa!',
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
          onClose={handleCloseTaskDetailModal}
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
              onClick={handleOpenTaskFormModal}
            >
              Editar
            </Button>

            <Button
              variant="outline"
              onClick={handleOpenTaskDeleteModal}
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
        onClose={handleCloseTaskFormModal}
        title={isEditing ? 'Editar tarefa' : 'Adicionar tarefa'}
      >
        <form onSubmit={taskFormik.handleSubmit}>
          <ModalBody pb={6}>
            <VStack gap={2}>
              <Input
                label="T??tulo"
                name="title"
                placeholder="T??tulo da tarefa"
                value={taskFormik.values.title}
                onChange={taskFormik.handleChange}
                error={taskFormik.errors.title}
              />

              <Textarea
                label="Descri????o"
                name="description"
                placeholder="Escreva aqui uma descri????o pra tarefa"
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
                  label="Dura????o"
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

            <Button variant="outline" onClick={handleCloseTaskFormModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {selectedTask !== null && (
        <Modal
          isOpen={isTaskDeleteModalOpen}
          onClose={handleCloseTaskDeleteModal}
          title="Aten????o"
          size="sm"
        >
          <ModalBody pb={6}>
            <Text color="text.primary" mt={6}>
              Deseja realmente remover a tarefa selecionada? Ap??s conclu??da,
              esta a????o n??o poder?? ser desfeita.
            </Text>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button
              variant="solid"
              colorScheme="red"
              onClick={handleDeleteTask}
              isLoading={isDeleting}
              loadingText="Removendo..."
            >
              Remover
            </Button>

            <Button variant="outline" onClick={handleCloseTaskDeleteModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      )}

      <Center width="100vw" height="100vh" bg="background" overflowX="hidden">
        <VStack
          width="100%"
          height="100%"
          spacing={10}
          maxW="860px"
          maxH="768px"
          marginX="auto"
          paddingBottom={5}
        >
          <Header
            onSearch={(value) => {
              setSearch(value);
              setSelectedView(
                value !== '' ? CalendarView.AGENDA : CalendarView.WEEK
              );
            }}
            onAddButtonClick={() => setIsTaskFormModalOpen(true)}
          />

          <VStack
            flex="1"
            width="100%"
            bg="white"
            borderRadius={8}
            padding={5}
            sx={{
              '.Kalend__main': {
                borderRadius: 8,
              },

              '.Kalend__main *': {
                fontFamily: 'body',
              },

              '.Kalend__CalendarHeader, .Kalend__CalendarHeader-dark, .Kalend__CalendarHeader-tall, .Kalend__CalendarHeader-tall-dark, .Kalend__CalendarHeader-small, .Kalend__CalendarHeader-day, .Kalend__CalendarHeader-tall-day':
                {
                  boxShadow: 'none',
                  backgroundColor: 'border',
                  borderRadius: 0,

                  height: 24,

                  justifyContent: 'center',
                },

              '.Kalend__CalendarHeader-small': {
                height: 10,
              },

              '.Kalend__CalendarHeaderCol': {
                paddingBottom: 0,
              },

              '.Kalend__CalendarHeaderColText__container': {
                height: 6,
              },

              '.Kalend__Event-normal, .Kalend__Event-normal-dark': {
                backgroundColor: 'brand !important',
                color: 'color !important',
                padding: 2,
              },

              '.Kalend__Event__summary': {
                padding: 0,
                fontWeight: 600,
              },
            }}
          >
            <Flex
              w="100%"
              alignItems="center"
              justifyContent="space-between"
              mb={8}
            >
              <HStack spacing={4}>
                <IconButton
                  aria-label="Voltar"
                  variant="ghost"
                  icon={<ChevronLeftIcon w={6} h={6} color="gray" />}
                  onClick={handleCalendarGoBack}
                />

                <Text
                  color="text.primary"
                  fontWeight={600}
                  fontSize={18}
                  textTransform="capitalize"
                >
                  {format(selectedDate, 'LLLL yyyy', { locale: ptBR })}
                </Text>

                <IconButton
                  aria-label="Pr??ximo"
                  variant="ghost"
                  icon={<ChevronRightIcon w={6} h={6} color="gray" />}
                  onClick={handleCalendarGoForward}
                />
              </HStack>

              <HStack spacing={16}>
                <Button
                  variant="ghost"
                  fontWeight={600}
                  color="gray"
                  onClick={handleCalendarGoToday}
                  fontSize={15}
                >
                  Hoje
                </Button>

                <ButtonGroup
                  spacing={0}
                  bg="border"
                  borderRadius="0.375rem"
                  fontWeight={500}
                  size="sm"
                  py={1.5}
                  px={3}
                >
                  <Button
                    variant={
                      selectedView === CalendarView.DAY ? 'solid' : 'ghost'
                    }
                    onClick={() => setSelectedView(CalendarView.DAY)}
                    fontWeight={500}
                    px={5}
                  >
                    Dia
                  </Button>

                  <Button
                    variant={
                      selectedView === CalendarView.WEEK ? 'solid' : 'ghost'
                    }
                    onClick={() => setSelectedView(CalendarView.WEEK)}
                    borderRadius="0.375rem"
                    fontWeight={500}
                    px={5}
                  >
                    Semana
                  </Button>

                  <Button
                    variant={
                      selectedView === CalendarView.MONTH ? 'solid' : 'ghost'
                    }
                    onClick={() => setSelectedView(CalendarView.MONTH)}
                    fontWeight={500}
                    px={5}
                  >
                    M??s
                  </Button>
                </ButtonGroup>
              </HStack>
            </Flex>

            <Kalend
              kalendRef={kalendRef}
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
              disabledViews={[CalendarView.THREE_DAYS, CalendarView.AGENDA]}
              selectedView={selectedView}
              onStateChange={handleCalendarStateChange}
              timeFormat="24"
              weekDayStart="Sunday"
              language="ptBR"
              disabledDragging
              hourHeight={60}
            />
          </VStack>
        </VStack>
      </Center>
    </>
  );
}

export default Home;
