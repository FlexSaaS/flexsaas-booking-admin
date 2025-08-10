import WeekHeader from "./WeekHeader";
import DaysHeader from "./DaysHeader";
import TimeLabels from "./TimeLabels";
import TimeSlotsGrid from "./TimeSlotsGrid";
import styled from "styled-components";
import { useRef, useEffect, useState, useMemo } from "react";
import CurrentTimeLine from "./CurrentTimeLine";
import EventsLayer from "./EventsLayer";
import AvailabilityLayer from "./AvailabilityLayer";
import type { AvailabilityType, EventType } from "../types";

type WeekViewProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  events: EventType[];
  availability: AvailabilityType[];
};

const HOURS_START = 8;
const HOURS_COUNT = 13;
const DAYS_IN_WEEK = 7;

function getStartOfWeek(date: Date) {
  const dayOfWeek = date.getDay();
  const daysFromMonday = (dayOfWeek + 6) % 7;
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - daysFromMonday);
  return start;
}

function generateWeekDays(startOfWeek: Date) {
  return Array.from({ length: DAYS_IN_WEEK }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return {
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      number: date.getDate(),
      fullDate: date.toLocaleDateString(),
      date,
    };
  });
}

function formatWeekRange(startOfWeek: Date) {
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + DAYS_IN_WEEK - 1);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  return `${startOfWeek.toLocaleDateString(
    undefined,
    options
  )} – ${endOfWeek.toLocaleDateString(undefined, options)}`;
}

function WeekView({
  selectedDate,
  setSelectedDate,
  events,
  availability,
}: WeekViewProps) {
  const startOfWeek = useMemo(
    () => getStartOfWeek(selectedDate),
    [selectedDate]
  );
  const days = useMemo(() => generateWeekDays(startOfWeek), [startOfWeek]);
  const hours = useMemo(
    () => Array.from({ length: HOURS_COUNT }, (_, i) => i + HOURS_START),
    []
  );

  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const [gridHeight, setGridHeight] = useState(0);
  const [gridWidth, setGridWidth] = useState(0);

  useEffect(() => {
    if (!gridWrapperRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setGridHeight(entry.contentRect.height);
        setGridWidth(entry.contentRect.width);
      }
    });

    observer.observe(gridWrapperRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <Container>
      <WeekHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        weekRange={formatWeekRange(startOfWeek)}
      />
      <WeekContainer>
        <DaysHeader days={days} />
        <TimeLabels hours={hours} />
        <GridWrapper
          ref={gridWrapperRef}
          style={{ gridColumn: "2 / span 7", gridRow: "3 / span 13" }}
        >
          <CurrentTimeLine
            gridWidth={gridWidth}
            gridHeight={gridHeight}
            daysCount={days.length}
            startOfWeek={startOfWeek}
          />
          <AvailabilityLayer
            gridWidth={gridWidth}
            gridHeight={gridHeight}
            daysCount={days.length}
            availability={availability}
            startOfWeek={startOfWeek} // pass here
          />
          <EventsLayer
            events={events}
            gridWidth={gridWidth}
            gridHeight={gridHeight}
            daysCount={days.length}
            startOfWeek={startOfWeek}
          />
          <TimeSlotsGrid daysLength={days.length} hoursLength={hours.length} />
        </GridWrapper>
      </WeekContainer>
    </Container>
  );
}

export default WeekView;

const GridWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(13, 1fr);
  box-sizing: border-box;
  position: relative;
`;

const WeekContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 60px repeat(7, minmax(100px, 1fr));
  grid-template-rows: auto auto repeat(13, minmax(30px, 1fr));
  height: 100%;
  box-sizing: border-box;
  padding: 25px 25px 25px 5px;
`;

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;
