import WeekHeader from "./Components/WeekHeader";
import DaysHeader from "./Components/DaysHeader";
import TimeLabels from "./Components/TimeLabels";
import TimeSlotsGrid from "./Components/TimeSlotsGrid";
import CurrentTimeLine from "./Layers/CurrentTimeLine";
import EventsLayer from "./Layers/AppointmentLayer";
import AvailabilityLayer from "./Layers/AvailabilityLayer";
import { useRef, useEffect, useState, useMemo } from "react";
import type { Appointment, AvailabilityType } from "../types";
import styled, { keyframes } from "styled-components";

type WeekViewProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  appointments: Appointment[];
  availability: AvailabilityType[];
  onDeleteEvent: (eventId: string) => void;
};

const HOURS_START = 8;
const HOURS_COUNT = 13;
const DAYS_IN_WEEK = 7;

/**
 * Returns the Monday of the week for the given date.
 */
function getStartOfWeek(date: Date) {
  const dayOfWeek = date.getDay();
  const daysFromMonday = (dayOfWeek + 6) % 7;
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - daysFromMonday);
  return start;
}

/**
 * Generates an array of days for the week starting from `startOfWeek`.
 */
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

/**
 * Formats the week range string (e.g., "Sep 1 – Sep 7").
 */
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

/**
 * WeekView displays a weekly calendar view with time slots, appointments, availability,
 * and a current time line indicator.
 */
function WeekView({
  selectedDate,
  setSelectedDate,
  appointments,
  availability,
  onDeleteEvent,
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

  // Observe grid wrapper size to dynamically calculate positions
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
            startOfWeek={startOfWeek}
          />
          <EventsLayer
            appointments={appointments}
            gridWidth={gridWidth}
            gridHeight={gridHeight}
            daysCount={days.length}
            startOfWeek={startOfWeek}
            onDeleteEvent={onDeleteEvent}
          />
          <TimeSlotsGrid daysLength={days.length} hoursLength={hours.length} />
        </GridWrapper>
      </WeekContainer>
    </Container>
  );
}

export default WeekView;

/* Styled Components */

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  animation: ${fadeIn} 0.5s ease-in-out;
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

const GridWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(13, 1fr);
  box-sizing: border-box;
  position: relative;
`;
