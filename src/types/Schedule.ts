export interface Schedule {
  id: number;
  scheduleContent: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleInput {
  scheduleContent: string;
  startTime: string;
  endTime: string;
}
