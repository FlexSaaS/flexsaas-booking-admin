import React, { useState, useRef } from "react";
import styled from "styled-components";
import type { AvailabilityType } from "../types";

interface PopupWindowProps {
  onClose: () => void;
  availableTimes: AvailabilityType[];
  onTimeSelected: (time: string, date: Date) => void;
}

/* -------------------- Helper Functions -------------------- */

// Convert total minutes to a human-readable "h:mmam/pm" string
function minutesToTimeString(totalMinutes: number) {
  let hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const ampm = hour >= 12 ? "pm" : "am";
  hour = hour % 12 || 12;
  const minuteStr = minute.toString().padStart(2, "0");
  return `${hour}:${minuteStr}${ampm}`;
}

// Convert "h:mmam/pm" string into total minutes
function timeStringToMinutes(timeStr: string): number | null {
  const match = timeStr.match(/(\d+):(\d+)(am|pm)/i);
  if (!match) return null;

  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const ampm = match[3].toLowerCase();

  if (ampm === "pm" && hour !== 12) hour += 12;
  if (ampm === "am" && hour === 12) hour = 0;

  return hour * 60 + minute;
}

// Filter out past time slots for today
function filterPastSlots(slots: string[], now: Date): string[] {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return slots.filter((timeStr) => {
    const totalMinutes = timeStringToMinutes(timeStr);
    return totalMinutes === null || totalMinutes > nowMinutes;
  });
}

// Generate all 30-min intervals between 9:00–16:30
function generateAllTimes(): string[] {
  const times: string[] = [];
  let hour = 9;
  let minute = 0;

  for (let i = 0; i < 16; i++) {
    const ampm = hour >= 12 ? "pm" : "am";
    const displayHour = hour > 12 ? hour - 12 : hour;
    const displayMinute = minute === 0 ? "00" : "30";
    times.push(`${displayHour}:${displayMinute}${ampm}`);

    minute += 30;
    if (minute === 60) {
      minute = 0;
      hour++;
    }
  }

  return times;
}

/* -------------------- Main Component -------------------- */

const Appointment: React.FC<PopupWindowProps> = ({
  onClose,
  availableTimes,
  onTimeSelected,
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [offset, setOffset] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [easeType, setEaseType] = useState("ease-in");
  const animatingRef = useRef(false);

  const dayShift = 53;
  const now = new Date();
  const allTimes = generateAllTimes();

  // Build 5-day window with available slots
  const days = Array.from({ length: 5 }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const matchedDay = availableTimes.find(
      (d) => d.date.toDateString() === date.toDateString()
    );

    let slots = matchedDay ? matchedDay.times.map(minutesToTimeString) : [];

    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      slots = filterPastSlots(slots, now);
    }

    return {
      date,
      day: date.getDate(),
      name: date.toLocaleDateString("en-US", { weekday: "short" }),
      slots,
    };
  });

  /* -------------------- Navigation Animations -------------------- */

  const shiftDay = (direction: "next" | "prev") => {
    if (animatingRef.current) return;
    const candidateDate = new Date(startDate);
    candidateDate.setDate(
      startDate.getDate() + (direction === "next" ? 1 : -1)
    );

    // Prevent going before today
    if (direction === "prev") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      candidateDate.setHours(0, 0, 0, 0);
      if (candidateDate < today) return;
    }

    animatingRef.current = true;
    setEaseType("ease-in");
    setTransitionEnabled(true);
    setOffset(direction === "next" ? -dayShift : dayShift);

    setTimeout(() => {
      setTransitionEnabled(false);
      setStartDate(candidateDate);
      setOffset(direction === "next" ? dayShift : -dayShift);

      setTimeout(() => {
        setEaseType("ease-out");
        setTransitionEnabled(true);
        setOffset(0);
        setTimeout(() => {
          setEaseType("ease-in");
          animatingRef.current = false;
        }, 400);
      }, 20);
    }, 400);
  };

  const nextDay = () => shiftDay("next");
  const prevDay = () => shiftDay("prev");

  /* -------------------- Render -------------------- */

  return (
    <Overlay>
      <Window>
        <Header>
          <NavButton
            onClick={prevDay}
            disabled={startDate <= new Date(new Date().setHours(0, 0, 0, 0))}
          >
            {"<"}
          </NavButton>
          <div>Select a Time</div>
          <NavButton onClick={nextDay}>{">"}</NavButton>
        </Header>

        <CalendarGrid>
          <DaysWrapper
            offset={offset}
            transitionEnabled={transitionEnabled}
            easeType={easeType}
          >
            {days.map((d, idx) => (
              <DayColumn key={idx}>
                <DayName>{d.name}</DayName>
                <DayHeader
                  active={d.date.toDateString() === now.toDateString()}
                >
                  {d.day}
                </DayHeader>
                {allTimes.map((time, i) => {
                  const available = d.slots.includes(time);
                  return (
                    <TimeSlot
                      key={i}
                      available={available}
                      onClick={() => available && onTimeSelected(time, d.date)}
                    >
                      {available ? time : <GreyLine />}
                    </TimeSlot>
                  );
                })}
              </DayColumn>
            ))}
          </DaysWrapper>
        </CalendarGrid>

        <CloseButton onClick={onClose}>Close</CloseButton>
      </Window>
    </Overlay>
  );
};

export default Appointment;

/* -------------------- Styled Components -------------------- */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const Window = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  height: 850px;
  min-width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
  padding-bottom: 10px;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const CalendarGrid = styled.div`
  overflow: hidden;
  width: 100%;
`;

const DaysWrapper = styled.div<{
  offset: number;
  transitionEnabled: boolean;
  easeType: string;
}>`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  transition: ${(props) =>
    props.transitionEnabled ? `transform 0.4s ${props.easeType}` : "none"};
  transform: translateX(${(props) => props.offset}px);
`;

const DayColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DayHeader = styled.div<{ active?: boolean }>`
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  color: ${(props) => (props.active ? "#fff" : "#333")};
  background: ${(props) => (props.active ? "#1976d2" : "transparent")};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
`;

const DayName = styled.div`
  font-size: 12px;
  margin-bottom: 8px;
`;

const TimeSlot = styled.button<{ available: boolean }>`
  background: white;
  border: 1px solid ${(props) => (props.available ? "#e3e3e3" : "white")};
  border-radius: 5px;
  width: 100px;
  height: 36px;
  display: flex;
  align-items: center;

  justify-content: center;
  font-size: 12px;
  color: ${(props) => (props.available ? "#1976d2" : "#999")};
  cursor: ${(props) => (props.available ? "pointer" : "default")};
  margin-bottom: 6px;
  transition: background 0.2s ease;

  &:hover {
    background: ${(props) => (props.available ? "#f0f6ff" : "#f5f5f5")};
  }
`;

const GreyLine = styled.div`
  width: 10px;
  height: 1.5px;
  background: #e4e4e4;
  border-radius: 1px;
`;

const CloseButton = styled.button`
  background: #ff5c5c;
  border: none;
  border-radius: 4px;
  color: white;
  padding: 6px 12px;
  cursor: pointer;
  margin-top: 20px;
  &:hover {
    background: #e04848;
  }
`;
