import React, { useEffect, useState } from "react";
import styled from "styled-components";

type CurrentTimeLineProps = {
  gridWidth: number;
  gridHeight: number;
  daysCount: number;
  startOfWeek: Date;
};

const CurrentTimeLine: React.FC<CurrentTimeLineProps> = ({
  gridWidth,
  gridHeight,
  daysCount,
  startOfWeek,
}) => {
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const isTodayInWeek = (startOfWeek: Date) => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(startOfWeek);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return today >= weekStart && today <= weekEnd;
  };

  useEffect(() => {
    if (!isTodayInWeek(startOfWeek)) {
      setPosition(null);
      return;
    }

    const updateTimeLine = () => {
      const now = new Date();

      const minutes = now.getHours() * 60 + now.getMinutes();
      const start = 8 * 60; // 8 AM
      const end = 21 * 60; // 9 PM

      if (minutes < start || minutes > end) {
        setPosition(null);
        return;
      }

      const todayIdx = (now.getDay() + 6) % 7; // Monday=0
      const columnWidth = gridWidth / daysCount;
      const elapsed = minutes - start;
      const percent = elapsed / (end - start);

      const top = Math.max(0, gridHeight * percent - 1);
      const left = Math.max(0, todayIdx * columnWidth);

      setPosition({ top, left, width: columnWidth });
    };

    updateTimeLine();
    const interval = setInterval(updateTimeLine, 60 * 1000);
    return () => clearInterval(interval);
  }, [gridWidth, gridHeight, daysCount, startOfWeek]);

  if (!position) return null;

  return (
    <TimeLine
      style={{ top: position.top, left: position.left, width: position.width }}
    />
  );
};

export default CurrentTimeLine;

const TimeLine = styled.div`
  position: absolute;
  height: 2px;
  background: red;
  z-index: 10;
  pointer-events: none;
`;
