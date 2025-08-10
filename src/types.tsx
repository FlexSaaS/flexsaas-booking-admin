export type EventType = {
  id: string;
  title: string;
  start: Date;
  end: Date;
};

export type AvailabilityType = {
  date: Date;
  times: number[];
  staffCount: number;
};
