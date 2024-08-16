import React, { ReactNode } from "react";
import {
  Table,
  ScrollArea,
  Text,
  TableProps,
  Card,
  TableThProps,
  TableTdProps,
  Badge,
} from "@mantine/core";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

export interface User {
  id: string | number;
  name: string;
  [key: string]: unknown;
}

export interface Event {
  id: string | number;
  userId: string | number;
  startTime: string;
  endTime: string;
  title: string;
  color?: string;
  [key: string]: unknown;
}

interface SchedulerProps extends Omit<TableProps, "children"> {
  date: Date | Dayjs;
  events: Event[];
  users: User[];
  timeSlots?: string[];
  timeFormat?: string;
  onEventClick?: (event: Event) => void;
  onCellClick?: (user: User, time: string) => void;
  cellRenderer?: (user: User, time: string, index: number) => ReactNode;
  userRenderer?: (user: User) => ReactNode;
  timeSlotRenderer?: (time: string) => ReactNode;
  tableProps?: Omit<TableProps, "children">;
  timeHeaderProps?: Partial<TableThProps>;
  userColumnProps?: Partial<TableTdProps>;
}

export const Scheduler: React.FC<SchedulerProps> = ({
  date,
  events,
  users,
  timeSlots,
  onEventClick,
  onCellClick,
  cellRenderer,
  userRenderer,
  timeSlotRenderer,
  timeFormat = "h:mm A",
  tableProps,
  timeHeaderProps = {},
  userColumnProps = {},
}) => {
  const defaultTimeHeaderStyle: React.CSSProperties = {
    width: 120,
    minWidth: 120,
  };

  const userColumnStyle: React.CSSProperties = {
    width: 200,
    minWidth: 200,
    backgroundColor: "white",
  };

  const defaultTimeSlots = Array.from({ length: 24 }, (_, i) =>
    dayjs(date).startOf("day").add(i, "hour").format(timeFormat),
  );

  const slots = timeSlots || defaultTimeSlots;

  const defaultCellRenderer = (user: User, time: string, index: number) => {
    const event = events.find(
      (e) =>
        e.userId === user.id &&
        dayjs(e.startTime, timeFormat).isSameOrBefore(
          dayjs(time, timeFormat),
        ) &&
        dayjs(e.endTime, timeFormat).isAfter(dayjs(time, timeFormat)),
    );

    if (event) {
      const startSlotIndex = slots.findIndex((slot) =>
        dayjs(event.startTime, timeFormat).isSameOrBefore(
          dayjs(slot, timeFormat),
        ),
      );

      if (index === startSlotIndex) {
        const cardColor = event.color;
        return (
          <Card
            shadow="sm"
            padding="xs"
            radius="md"
            withBorder
            onClick={() => onEventClick && onEventClick(event)}
            style={(theme) => ({
              cursor: "pointer",
              backgroundColor: cardColor ? theme.colors[cardColor][2] : "",
            })}
          >
            <Card.Section>
              <Text pl={10} pt={5} fw={500} size="sm">
                {event.title}
              </Text>
            </Card.Section>
            <Badge size="xs" variant="filled" color={event.color}>
              {dayjs(event.startTime, timeFormat).format(timeFormat)} -{" "}
              {dayjs(event.endTime, timeFormat).format(timeFormat)}
            </Badge>
          </Card>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  const defaultUserRenderer = (user: User) => <Text fw={500}>{user.name}</Text>;
  const defaultTimeSlotRenderer = (time: string) => (
    <Text fw={500}>{time}</Text>
  );

  return (
    <ScrollArea offsetScrollbars>
      <Table {...tableProps}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>User</Table.Th>
            {slots.map((time) => (
              <Table.Th
                key={time}
                style={{
                  ...defaultTimeHeaderStyle,
                  ...timeHeaderProps.style,
                }}
                {...timeHeaderProps}
              >
                {timeSlotRenderer
                  ? timeSlotRenderer(time)
                  : defaultTimeSlotRenderer(time)}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((user) => (
            <Table.Tr key={user.id}>
              <Table.Td
                style={{
                  ...userColumnStyle,
                  ...userColumnProps.style,
                }}
                {...userColumnProps}
              >
                {userRenderer ? userRenderer(user) : defaultUserRenderer(user)}
              </Table.Td>
              {slots.map((time, index) => {
                const event = events.find(
                  (e) =>
                    e.userId === user.id &&
                    dayjs(e.startTime, timeFormat).isSameOrBefore(
                      dayjs(time, timeFormat),
                    ) &&
                    dayjs(e.endTime, timeFormat).isAfter(
                      dayjs(time, timeFormat),
                    ),
                );

                if (event) {
                  const startSlotIndex = slots.findIndex((slot) =>
                    dayjs(event.startTime, timeFormat).isSameOrBefore(
                      dayjs(slot, timeFormat),
                    ),
                  );

                  if (index === startSlotIndex) {
                    const endSlotIndex = slots.findIndex((slot) =>
                      dayjs(event.endTime, timeFormat).isSameOrBefore(
                        dayjs(slot, timeFormat),
                      ),
                    );
                    const duration = endSlotIndex - startSlotIndex || 1;

                    return (
                      <Table.Td
                        key={`${user.id}-${time}`}
                        onClick={() => onCellClick && onCellClick(user, time)}
                        style={{ height: "70px" }}
                        colSpan={duration}
                      >
                        {cellRenderer
                          ? cellRenderer(user, time, index)
                          : defaultCellRenderer(user, time, index)}
                      </Table.Td>
                    );
                  } else if (index > startSlotIndex) {
                    return null;
                  }
                }

                return (
                  <Table.Td
                    key={`${user.id}-${time}`}
                    onClick={() => onCellClick && onCellClick(user, time)}
                    style={{ height: "70px" }}
                  >
                    {cellRenderer
                      ? cellRenderer(user, time, index)
                      : defaultCellRenderer(user, time, index)}
                  </Table.Td>
                );
              })}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
};
