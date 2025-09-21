import { useEffect, useState } from "react";
import styled from "styled-components";
import { END_MINUTES, START_MINUTES } from "../../utils";

type CurrentTimeLineProps = {
  gridWidth: number;
  gridHeight: number;
  daysCount: number;
  startOfWeek: Date;
};

/**
 * CurrentTimeLine renders a red horizontal line at the current time
 * if today falls within the displayed week and time is within working hours.
 */
function CurrentTimeLine({
  gridWidth,
  gridHeight,
  daysCount,
  startOfWeek,
}: CurrentTimeLineProps) {
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const isTodayInWeek = () => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(startOfWeek);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return today >= weekStart && today <= weekEnd;
  };

  useEffect(() => {
    if (!isTodayInWeek()) {
      setPosition(null);
      return;
    }

    const updateTimeLine = () => {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();

      if (minutes < START_MINUTES || minutes > END_MINUTES) {
        setPosition(null);
        return;
      }

      const todayIdx = (now.getDay() + 6) % 7; // Monday = 0
      const columnWidth = gridWidth / daysCount;
      const percent = (minutes - START_MINUTES) / (END_MINUTES - START_MINUTES);

      setPosition({
        top: gridHeight * percent - 1,
        left: todayIdx * columnWidth,
        width: columnWidth,
      });
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
}

export default CurrentTimeLine;

const TimeLine = styled.div`
  position: absolute;
  height: 2px;
  background: red;
  z-index: 10;
  pointer-events: none;
`;
