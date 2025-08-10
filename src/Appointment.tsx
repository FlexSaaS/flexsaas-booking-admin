import React, { useState, useRef } from "react";
import styled from "styled-components";
import type { AvailabilityType, EventType } from "./types";

interface PopupWindowProps {
  onClose: () => void;
  availableTimes: AvailabilityType[];
  onTimeSelected: (event: EventType) => void;
}

function minutesToTimeString(totalMinutes: number) {
  let hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const ampm = hour >= 12 ? "pm" : "am";
  hour = hour % 12 || 12; // convert 0 to 12 for 12-hour format
  const minuteStr = minute === 0 ? "00" : minute.toString().padStart(2, "0");
  return `${hour}:${minuteStr}${ampm}`;
}

const Appointment: React.FC<PopupWindowProps> = ({
  onClose,
  availableTimes,
  onTimeSelected,
}) => {
  const [startDate, setStartDate] = useState(new Date());

  const [offset, setOffset] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const dayShift = 53;
  const animatingRef = useRef(false);
  const [easyType, setEasyType] = useState("ease-in");

  const now = new Date();

  const handleTimeClick = (time: string, date: Date) => {
    console.log(`Clicked time: ${time} on date: ${date.toDateString()}`);

    // Parse time string like "9:00am" or "12:30pm"
    const match = time.match(/^(\d+):(\d+)(am|pm)$/i);
    if (!match) {
      console.error("Invalid time format:", time);
      return;
    }
    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const ampm = match[3].toLowerCase();

    if (ampm === "pm" && hour !== 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;

    // Create start datetime by copying date and setting hours and minutes
    const start = new Date(date);
    start.setHours(hour, minute, 0, 0);

    // Create end datetime 1 hour later (customize as needed)
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    const event: EventType = {
      id: String(Date.now()), // example unique id
      title: `Event at ${time}`,
      start,
      end,
    };

    console.log("Created event:", event);

    if (onTimeSelected) onTimeSelected(event);
  };

  const days = Array.from({ length: 5 }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const matchedDay = availableTimes.find(
      (d) => d.date.toDateString() === date.toDateString()
    );

    let slots = matchedDay ? matchedDay.times.map(minutesToTimeString) : [];

    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      slots = slots.filter((timeStr) => {
        const match = timeStr.match(/(\d+):(\d+)(am|pm)/i);
        if (!match) return true;

        let hour = parseInt(match[1], 10);
        const minute = parseInt(match[2], 10);
        const ampm = match[3].toLowerCase();

        if (ampm === "pm" && hour !== 12) hour += 12;
        if (ampm === "am" && hour === 12) hour = 0;

        const totalMinutes = hour * 60 + minute;

        return totalMinutes > nowMinutes;
      });
    }

    return {
      date,
      day: date.getDate(),
      name: date.toLocaleDateString("en-US", { weekday: "short" }),
      slots,
    };
  });

  const generateAllTimes = () => {
    const times = [];
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
  };

  const allTimes = generateAllTimes();

  const nextDay = () => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setEasyType("ease-in");
    setTransitionEnabled(true);
    setOffset(-dayShift);

    setTimeout(() => {
      setTransitionEnabled(false);
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + 1);
      setStartDate(newDate);
      setOffset(dayShift);

      setTimeout(() => {
        setEasyType("ease-out");
        setTransitionEnabled(true);
        setOffset(0);
        setTimeout(() => {
          setEasyType("ease-in");
          animatingRef.current = false;
        }, 400);
      }, 20);
    }, 400);
  };

  const prevDay = () => {
    if (animatingRef.current) return;

    const candidateDate = new Date(startDate);
    candidateDate.setDate(startDate.getDate() - 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    candidateDate.setHours(0, 0, 0, 0);

    if (candidateDate < today) {
      return;
    }

    animatingRef.current = true;

    setEasyType("ease-in");
    setTransitionEnabled(true);
    setOffset(dayShift);

    setTimeout(() => {
      setTransitionEnabled(false);
      setStartDate(candidateDate);
      setOffset(-dayShift);

      setTimeout(() => {
        setEasyType("ease-out");
        setTransitionEnabled(true);
        setOffset(0);

        setTimeout(() => {
          setEasyType("ease-in");
          animatingRef.current = false;
        }, 400);
      }, 20);
    }, 400);
  };

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
            easeType={easyType}
          >
            {days.map((d, idx) => (
              <DayColumn key={idx}>
                <DayName>{d.name}</DayName>
                <DayHeader
                  active={
                    d.date.getDate() === new Date().getDate() &&
                    d.date.getMonth() === new Date().getMonth() &&
                    d.date.getFullYear() === new Date().getFullYear()
                  }
                >
                  {d.day}
                </DayHeader>
                {allTimes.map((time, i) => {
                  const available = d.slots.includes(time);
                  return (
                    <TimeSlot
                      key={i}
                      available={available}
                      onClick={() => available && handleTimeClick(time, d.date)}
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

const Overlay = styled.div`
  /* same as before */
  color: black;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
    props.transitionEnabled
      ? `transform 0.4s ${props.easeType || "ease"}`
      : "none"};
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
