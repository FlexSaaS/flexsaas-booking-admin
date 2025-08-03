import React from "react";
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
  gridWidth: number;
  gridHeight: number;
  daysCount: number;
  startOfWeek: Date;
};

const START_MINUTES = 8 * 60; // 8am
const END_MINUTES = 21 * 60; // 9pm

const EventsLayer: React.FC<EventsLayerProps> = ({
  events,
  gridWidth,
  gridHeight,
  daysCount,
  startOfWeek,
}) => {
  // Helper: calculate vertical position and height
  const getPositionStyles = (event: Event) => {
    const startMinutes = event.start.getHours() * 60 + event.start.getMinutes();
    const endMinutes = event.end.getHours() * 60 + event.end.getMinutes();

    // Clamp times within visible range
    const startClamped = Math.max(startMinutes, START_MINUTES);
    const endClamped = Math.min(endMinutes, END_MINUTES);

    if (endClamped <= START_MINUTES || startClamped >= END_MINUTES) {
      return null; // event outside visible time
    }

    const topPercent =
      (startClamped - START_MINUTES) / (END_MINUTES - START_MINUTES);
    const bottomPercent =
      (endClamped - START_MINUTES) / (END_MINUTES - START_MINUTES);
    const top = topPercent * gridHeight;
    const height = (bottomPercent - topPercent) * gridHeight;

    // Horizontal position by day column
    const eventDay = (event.start.getDay() + 6) % 7; // Monday=0
    const columnWidth = gridWidth / daysCount;
    const left = eventDay * columnWidth;

    return { top, left, height, width: columnWidth };
  };

  const isEventInWeek = (eventStart: Date, startOfWeek: Date) => {
    const start = new Date(startOfWeek);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    const eventDate = new Date(eventStart);
    eventDate.setHours(0, 0, 0, 0);

    return eventDate >= start && eventDate <= end;
  };

  return (
    <>
      {events
        .filter((event) => isEventInWeek(event.start, startOfWeek))
        .map((event) => {
          const pos = getPositionStyles(event);
          if (!pos) return null;

          return (
            <EventItem
              key={event.id}
              style={{
                top: pos.top,
                left: pos.left,
                height: pos.height,
                width: pos.width,
                backgroundColor: event.color || "#3498db",
              }}
              title={`${
                event.title
              }\n${event.start.toLocaleTimeString()} - ${event.end.toLocaleTimeString()}`}
            >
              {event.title}
            </EventItem>
          );
        })}
    </>
  );
};

export default EventsLayer;

const EventItem = styled.div`
  position: absolute;
  padding: 2px 5px;
  box-sizing: border-box;
  border-radius: 4px;
  color: white;
  font-size: 0.75rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  user-select: none;
`;
