import { Scheduler, User, Event } from "../lib/Scheduler";
import dayjs from "dayjs";
import { generateTimeSlots } from "../lib/utils";
import { Avatar, Container, Group, Paper, Text } from "@mantine/core";

function App() {
  const users: User[] = [
    { id: 1, name: "John Doe", avatar: "https://i.pravatar.cc/150?img=1" },
  ];

  const events: Event[] = [
    {
      id: 1,
      userId: 1,
      startTime: "9:00 AM",
      endTime: "10:00 AM",
      title: "Meeting",
      color: "blue",
    },
    {
      id: 2,
      userId: 1,
      startTime: "2:00 PM",
      endTime: "4:00 PM",
      title: "Project Work",
      color: "green",
    },
  ];

  const handleEventClick = (event: Event) => {
    alert(`Event clicked: ${event.id}`);
  };

  const handleCellClick = (user: User, time: string) => {
    console.log("Cell clicked:", user, time);
  };

  const timeSlots = generateTimeSlots({
    start: "9:00 AM",
    end: "5:30 PM",
    interval: 30,
  });

  const CustomEventRenderer = ({ event }: any) => (
    <div style={{ backgroundColor: event.color, padding: "4px" }}>
      <strong>{event.title}</strong>
      <p>{event.description}</p>
    </div>
  );

  return (
    <>
      <Container mt={35}>
        <Paper withBorder radius="md" shadow="sm" p={15}>
          <Scheduler
            date={dayjs()}
            timeSlots={timeSlots}
            events={events}
            users={users}
            onEventClick={handleEventClick}
            onCellClick={handleCellClick}
            userRenderer={(user) => (
              <>
                <Group>
                  <Avatar src={user.avatar as string} radius="xl" />
                  <Text size="sm" fw={500}>
                    {user.name}
                  </Text>
                </Group>
              </>
            )}
            tableProps={{
              striped: true,
              highlightOnHover: true,
              withColumnBorders: true,
            }}
          />
        </Paper>
      </Container>
    </>
  );
}

export default App;
