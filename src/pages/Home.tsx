import {
  Center,
  Flex,
  Grid,
  ModalBody,
  ModalFooter,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { addMinutes, parseISO } from 'date-fns';
import { useFormik } from 'formik';
import Kalend, { CalendarView, CalendarEvent } from 'kalend';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';
import Modal from '../components/Modals/Modal';
import TaskDetailModal from '../components/Modals/TaskDetailModal';
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
        <TaskDetailModal
          task={selectedTask}
          isOpen={isTaskDetailModalOpen}
          onClose={() => setIsTaskDetailModalOpen(false)}
        />
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
