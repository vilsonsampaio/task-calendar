import { Box } from '@chakra-ui/react';
import Kalend, { CalendarView, CalendarEvent } from 'kalend';

import 'kalend/dist/styles/index.css';
import theme from '../../styles/theme';

const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    startAt: new Date().toISOString(),
    endAt: new Date().toISOString(),
    timezoneStartAt: 'Europe/Berlin', // optional
    timezoneEndAt: 'Europe/Berlin', // optional
    summary: 'test',
    color: theme.colors.brand,
  },
  {
    id: 2,
    startAt: '2021-08-12T18:00:00.000Z',
    endAt: '2021-08-12T19:00:00.000Z',
    timezoneStartAt: 'Europe/Berlin', // optional
    timezoneEndAt: 'Europe/Berlin', // optional
    summary: 'test',
    color: theme.colors.brand,
  },
];

function Home() {
  return (
    <Box width="100vw" height="100vh" bg="background">
      <Box width="100%" height="100%" bg="white">
        <Kalend
          events={mockEvents}
          onEventClick={(e) => alert(JSON.stringify(e))}
          initialDate={new Date().toISOString()}
          initialView={CalendarView.WEEK}
          disabledViews={[CalendarView.THREE_DAYS, CalendarView.AGENDA]}
          // onSelectView={(e) => console.log(e)}
          // selectedView={(e) => console.log(e)}
          // onPageChange={(e) => console.log(e)}
          timeFormat="24"
          weekDayStart="Sunday"
          language="ptBR"
          disabledDragging
          colors={{
            light: {
              primaryColor: theme.colors.brand,
            },
            dark: {
              primaryColor: theme.colors.brand,
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default Home;
