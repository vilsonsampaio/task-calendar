import { Center, Flex, Spinner, VStack } from '@chakra-ui/react';
import { addMinutes } from 'date-fns';
import Kalend, { CalendarView, CalendarEvent } from 'kalend';
import { useEffect, useState } from 'react';

import Header from '../components/Header';
import AddTaskModal from '../components/Modals/AddTaskModal';
import TaskService, { Task } from '../services/TaskService';
import theme from '../styles/theme';
import convertTimeDurationInMinutes from '../utils/convertTimeDurationInMinutes';
import 'kalend/dist/styles/index.css';

type CalendarTask = CalendarEvent & Omit<Task, 'id'>;

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<CalendarTask[]>([]);

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

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
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
      />

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
              onEventClick={(e) => alert(JSON.stringify(e))}
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
