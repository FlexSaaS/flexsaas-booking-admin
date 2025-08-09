import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

interface DayAvailability {
  date: Date;
  times: string[];
}

interface PopupWindowProps {
  onClose: () => void;
  availableTimes: DayAvailability[]; // new prop
}

const Appointment: React.FC<PopupWindowProps> = ({
  onClose,
  availableTimes,
}) => {
  const [startDate, setStartDate] = useState(new Date());

  const [offset, setOffset] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const dayShift = 46;
  const animatingRef = useRef(false);
  const [easyType, setEasyType] = useState("ease-in");

  const now = new Date();

  const days = Array.from({ length: 5 }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const matchedDay = availableTimes.find(
      (d) => d.date.toDateString() === date.toDateString()
    );

    let slots = matchedDay ? matchedDay.times : [];

    // If this day is today, filter out slots earlier than now
    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      slots = slots.filter((timeStr) => {
        // Parse time string like "9:30am" into minutes since midnight
        const match = timeStr.match(/(\d+):(\d+)(am|pm)/i);
        if (!match) return true; // keep if parsing fails

        let hour = parseInt(match[1], 10);
        const minute = parseInt(match[2], 10);
        const ampm = match[3].toLowerCase();

        if (ampm === "pm" && hour !== 12) hour += 12;
        if (ampm === "am" && hour === 12) hour = 0;

        const totalMinutes = hour * 60 + minute;

        return totalMinutes > nowMinutes; // keep only slots after now
      });
    }

    return {
      date,
      day: date.getDate(),
      name: date.toLocaleDateString("en-US", { weekday: "short" }),
      slots,
    };
  });

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

    // Calculate the candidate new date for prev day
    const candidateDate = new Date(startDate);
    candidateDate.setDate(startDate.getDate() - 1);

    // Check if candidateDate is before today (ignore time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    candidateDate.setHours(0, 0, 0, 0);

    if (candidateDate < today) {
      // Don't allow going before today
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
                {d.slots.map((time, i) => (
                  <TimeSlot key={i}>{time}</TimeSlot>
                ))}
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
  /* same as before */
  background: white;
  border-radius: 12px;
  padding: 20px;
  min-width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-family: Arial, sans-serif;
`;

const Header = styled.div`
  /* same as before */
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
  padding-bottom: 10px;
`;

const NavButton = styled.button`
  /* same as before */
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

const TimeSlot = styled.button`
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 12px;
  color: #1976d2;
  cursor: pointer;
  margin-bottom: 6px;
  transition: background 0.2s ease;

  &:hover {
    background: #f0f6ff;
  }
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
