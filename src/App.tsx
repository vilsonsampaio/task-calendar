import Kalend, { CalendarView, CalendarEvent } from 'kalend'; // import component
import 'kalend/dist/styles/index.css'; // import styles

const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    startAt: new Date().toISOString(),
    endAt: new Date().toISOString(),
    timezoneStartAt: 'Europe/Berlin', // optional
    timezoneEndAt: 'Europe/Berlin', // optional
    summary: 'test',
    color: 'blue',
  },
  {
    id: 2,
    startAt: '2021-08-12T18:00:00.000Z',
    endAt: '2021-08-12T19:00:00.000Z',
    timezoneStartAt: 'Europe/Berlin', // optional
    timezoneEndAt: 'Europe/Berlin', // optional
    summary: 'test',
    color: 'blue',
  },
];

function App() {
  return (
    <div style={{ height: '100vh' }}>
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
      />
    </div>
  );
}

export default App;
