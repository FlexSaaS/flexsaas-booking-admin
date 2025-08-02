import { useCallback, useEffect, useRef, useState } from "react";
import WeekHeader from "./WeekHeader";
import DaysHeader from "./DaysHeader";
import TimeLabels from "./TimeLabels";
import TimeSlotsGrid from "./TimeSlotsGrid";
import CurrentTimeLine from "./CurrentTimeLine";
import styled from "styled-components";
import EventsLayer from "./EventsLayer";

type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
};

type WeekViewProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  events?: Event[];
};

function WeekView({
  selectedDate,
  setSelectedDate,
  events = [],
}: WeekViewProps) {
  const weekContainerRef = useRef<HTMLDivElement>(null);
  const [currentLinePos, setCurrentLinePos] = useState<{
    top: number;
    col: number;
  } | null>(null);

  const [slotHeight, setSlotHeight] = useState(30);

  useEffect(() => {
    const firstSlot = weekContainerRef.current?.querySelector(
      "[data-timeslot]"
    ) as HTMLElement;

    if (!firstSlot) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newHeight = entry.contentRect.height;
        setSlotHeight(newHeight);
      }
    });

    observer.observe(firstSlot);

    return () => observer.disconnect();
  }, []);

  const calculateCurrentLinePos = useCallback(() => {
    if (!weekContainerRef.current) return;

    const now = new Date();

    const dayOfWeek = selectedDate.getDay();
    const daysFromMonday = (dayOfWeek + 6) % 7;
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - daysFromMonday);

    const isCurrentWeek =
      now >= startOfWeek &&
      now < new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (!isCurrentWeek) {
      setCurrentLinePos(null);
      return;
    }

    const container = weekContainerRef.current;
    const firstSlot = container.querySelector("[data-timeslot]") as HTMLElement;
    const firstSlotTop = firstSlot?.offsetTop ?? 0;

    const startHour = 8;
    const endHour = 20;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (currentHour < startHour || currentHour > endHour) {
      setCurrentLinePos(null);
      return;
    }

    const hoursFromStart = currentHour - startHour + currentMinute / 60;
    const topPosition = firstSlotTop + hoursFromStart * slotHeight + 22;

    const dayIndex = (now.getDay() + 6) % 7;
    const gridColumn = dayIndex + 2;

    setCurrentLinePos({ top: topPosition, col: gridColumn });
  }, [selectedDate, slotHeight]);

  useEffect(() => {
    calculateCurrentLinePos();
  }, [calculateCurrentLinePos]);

  useEffect(() => {
    window.addEventListener("resize", calculateCurrentLinePos);
    return () => {
      window.removeEventListener("resize", calculateCurrentLinePos);
    };
  }, [calculateCurrentLinePos]);

  const dayOfWeek = selectedDate.getDay();
  const daysFromMonday = (dayOfWeek + 6) % 7;
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - daysFromMonday);

  const hours = Array.from({ length: 13 }, (_, i) => i + 8);

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return {
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      number: date.getDate(),
      fullDate: date.toLocaleDateString(),
    };
  });

  const formatWeekRange = () => {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return `${startOfWeek.toLocaleDateString(
      undefined,
      options
    )} – ${endOfWeek.toLocaleDateString(undefined, options)}`;
  };

  return (
    <Container>
      <WeekHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        weekRange={formatWeekRange()}
      />
      <WeekContainer ref={weekContainerRef}>
        <DaysHeader days={days} />
        <TimeLabels hours={hours} />
        <TimeSlotsGrid daysLength={days.length} hoursLength={hours.length} />

        <EventsLayer
          events={events}
          startOfWeek={startOfWeek}
          slotHeight={slotHeight}
          startHour={8}
          endHour={20}
          containerRef={weekContainerRef}
        />

        {currentLinePos && (
          <CurrentTimeLine top={currentLinePos.top} col={currentLinePos.col} />
        )}
      </WeekContainer>
    </Container>
  );
}

export default WeekView;

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
