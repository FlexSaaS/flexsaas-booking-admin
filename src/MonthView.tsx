import styled from "styled-components";
import { useState, type ReactElement } from "react";

// --- Styled Components ---
const Content = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: #fff;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CalendarWrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 1rem;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

const DayNames = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: left;
  gap: 4px;
  height: 100%;
`;

const Day = styled.div<{ isToday?: boolean }>`
  padding: 0.5rem 0.5rem 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: ${({ isToday }) => (isToday ? "#90caf9" : "#f0f0f0")};
  font-weight: ${({ isToday }) => (isToday ? "bold" : "normal")};
  cursor: pointer;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const DayNumber = styled.div`
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
`;

const EventText = styled.div`
  font-size: 0.75rem;
  color: #b71c1c;
  line-height: 1.1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* show max 3 lines */
  -webkit-box-orient: vertical;
  white-space: normal;
`;

// --- Helper Functions ---
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// --- Component ---
function MainContent(): ReactElement {
  const today = new Date();
  const [month, setMonth] = useState<number>(today.getMonth());
  const [year, setYear] = useState<number>(today.getFullYear());

  const [events, setEvents] = useState<Record<string, string[]>>({});

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);
  const dayNames: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleAddEvent = (day: number) => {
    const eventText = prompt("Add event description:");
    if (!eventText) return;

    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    setEvents((prev) => {
      const dayEvents = prev[dateKey] || [];
      return { ...prev, [dateKey]: [...dayEvents, eventText] };
    });
  };

  const days: ReactElement[] = [];

  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} />);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const isToday =
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      i
    ).padStart(2, "0")}`;
    const dayEvents = events[dateKey] || [];

    days.push(
      <Day
        key={i}
        isToday={isToday}
        onClick={() => handleAddEvent(i)}
        title={dayEvents.join("\n")}
      >
        <DayNumber>{i}</DayNumber>
        {dayEvents.map((ev, idx) => (
          <EventText key={idx}>{ev}</EventText>
        ))}
      </Day>
    );
  }

  return (
    <Content>
      <CalendarWrapper>
        <DayNames>
          {dayNames.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </DayNames>
        <CalendarGrid>{days}</CalendarGrid>
      </CalendarWrapper>
    </Content>
  );
}

export default MainContent;
