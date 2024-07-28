import dayjs, { Dayjs } from "dayjs";

export interface GenerateTimeSlotsOptions {
  start: string | Dayjs;
  end: string | Dayjs;
  interval?: number;
  format?: string;
}

export function generateTimeSlots({
  start,
  end,
  interval = 60,
  format = "h:mm A",
}: GenerateTimeSlotsOptions): string[] {
  const startTime = dayjs(start, "h:mm A", true);
  const endTime = dayjs(end, "h:mm A", true);

  const slots: string[] = [];

  if (!startTime.isValid() || !endTime.isValid()) {
    console.error("Invalid start or end time");
    return slots;
  }

  if (endTime.isBefore(startTime)) {
    console.error("End time must be after start time");
    return slots;
  }

  if (interval <= 0) {
    console.error("Interval must be greater than 0");
    return slots;
  }

  let currentSlot = startTime;

  while (currentSlot.isBefore(endTime) || currentSlot.isSame(endTime)) {
    slots.push(currentSlot.format(format));
    currentSlot = currentSlot.add(interval, "minute");
  }

  return slots;
}
