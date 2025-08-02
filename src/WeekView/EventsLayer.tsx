import { useEffect, useState, type RefObject } from "react";
import styled from "styled-components";

type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
};

type EventsLayerProps = {
  events: Event[];
  startOfWeek: Date;
  slotHeight: number;
  startHour: number;
  endHour: number;
  containerRef: RefObject<HTMLDivElement | null>;
};

function EventsLayer({
  events,
  startOfWeek,
  slotHeight,
  startHour,
  endHour,
  containerRef,
}: EventsLayerProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const dayCount = 7;

  useEffect(() => {
    if (!containerRef.current) return;
    setContainerWidth(containerRef.current.clientWidth);

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [containerRef]);

  const dayWidth = (containerWidth - 60) /* time label width */ / dayCount;

  const dayMs = 24 * 60 * 60 * 1000;

  return (
    <>
      {events.map((event) => {
        const eventStart = event.start;
        const eventEnd = event.end;

        // Calculate day index (0 = Monday, ... 6 = Sunday)
        const dayIndex = Math.floor(
          (eventStart.getTime() - startOfWeek.getTime()) / dayMs
        );
        if (dayIndex < 0 || dayIndex >= dayCount) return null; // Out of week range

        // Calculate top and height (in px)
        const startHourDecimal =
          eventStart.getHours() + eventStart.getMinutes() / 60;
        const endHourDecimal = eventEnd.getHours() + eventEnd.getMinutes() / 60;

        // Ignore events outside display hours
        if (endHourDecimal <= startHour || startHourDecimal >= endHour)
          return null;

        // Clamp times to visible range
        const clampedStart = Math.max(startHourDecimal, startHour);
        const clampedEnd = Math.min(endHourDecimal, endHour);

        const top = (clampedStart - startHour) * slotHeight + 75;

        const height = (clampedEnd - clampedStart) * slotHeight;

        // Calculate horizontal position
        const left = 48 + dayIndex * dayWidth; // 60px is time label col width

        return (
          <EventBlock
            key={event.id}
            style={{
              top,
              height,
              left,
              width: dayWidth - 4, // some gap between days
              backgroundColor: event.color || "#3182ce",
            }}
            title={`${
              event.title
            }\n${eventStart.toLocaleTimeString()} - ${eventEnd.toLocaleTimeString()}`}
          >
            {event.title}
          </EventBlock>
        );
      })}
    </>
  );
}

const EventBlock = styled.div`
  position: absolute;
  padding: 4px 6px;
  color: white;
  font-size: 12px;
  border-radius: 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  box-sizing: border-box;
  user-select: none;
  z-index: 10;
  transition: top 0.2s ease, height 0.2s ease;
`;

export default EventsLayer;
