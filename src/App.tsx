import { Scheduler, User, Event } from "../lib/Scheduler";
import dayjs from "dayjs";
import { generateTimeSlots } from "../lib/utils";
import { Avatar, Container, Group, Paper, Text } from "@mantine/core";

function App() {
  const users: User[] = [
    { id: 1, name: "John Doe", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Jane Smith", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Alice Johnson", avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "Bob Williams", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 5, name: "Eva Brown", avatar: "https://i.pravatar.cc/150?img=5" },
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
      userId: 2,
      startTime: "2:00 PM",
      endTime: "4:00 PM",
      title: "Project Work",
      color: "green",
    },
    {
      id: 3,
      userId: 3,
      startTime: "10:30 AM",
      endTime: "11:30 AM",
      title: "Client Call",
      color: "violet",
    },
    {
      id: 4,
      userId: 3,
      startTime: "3:00 PM",
      endTime: "5:00 PM",
      title: "Team Building",
      color: "orange",
    },
    {
      id: 5,
      userId: 4,
      startTime: "1:00 PM",
      endTime: "2:30 PM",
      title: "Lunch Meeting",
      color: "red",
    },
    {
      id: 6,
      userId: 4,
      startTime: "4:30 PM",
      endTime: "5:30 PM",
      title: "Code Review",
      color: "cyan",
    },
    {
      id: 7,
      userId: 5,
      startTime: "11:00 AM",
      endTime: "12:00 PM",
      title: "Training Session",
      color: "yellow",
    },
    {
      id: 8,
      userId: 5,
      startTime: "2:30 PM",
      endTime: "3:30 PM",
      title: "Design Review",
      color: "pink",
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
