import React from "react";
import styled from "styled-components";

type AvailabilityMap = {
  [dayIndex: number]: { start: Date; end: Date } | null;
};

type AvailabilityLayerProps = {
  gridWidth: number;
  gridHeight: number;
  daysCount: number;
  availability: AvailabilityMap;
};

const START_MINUTES = 8 * 60;
const END_MINUTES = 21 * 60;

const toMinutes = (date: Date) => date.getHours() * 60 + date.getMinutes();

const AvailabilityLayer: React.FC<AvailabilityLayerProps> = ({
  gridWidth,
  gridHeight,
  daysCount,
  availability,
}) => {
  const columnWidth = gridWidth / daysCount;
  const totalMinutes = END_MINUTES - START_MINUTES;

  return (
    <>
      {Array.from({ length: daysCount }, (_, dayIndex) => {
        const slot = availability[dayIndex];
        const overlays = [];

        if (!slot) {
          overlays.push({ top: 0, height: gridHeight });
        } else {
          const availableStart = toMinutes(slot.start);
          const availableEnd = toMinutes(slot.end);

          if (availableStart > START_MINUTES) {
            const top =
              ((availableStart - START_MINUTES) / totalMinutes) * gridHeight;
            overlays.push({ top: 0, height: top });
          }

          if (availableEnd < END_MINUTES) {
            const top =
              ((availableEnd - START_MINUTES) / totalMinutes) * gridHeight;
            const height =
              ((END_MINUTES - availableEnd) / totalMinutes) * gridHeight;
            overlays.push({ top, height });
          }
        }

        return overlays.map((pos, i) => {
          const isFirstDay = dayIndex === 0;
          const isLastDay = dayIndex === daysCount - 1;
          const isTop = pos.top === 0;
          const isBottom = pos.top + pos.height >= gridHeight;

          const borderRadius = `
            ${isFirstDay && isTop ? "8px" : "0"} 
            ${isLastDay && isTop ? "8px" : "0"} 
            ${isLastDay && isBottom ? "8px" : "0"} 
            ${isFirstDay && isBottom ? "8px" : "0"}
          `;

          return (
            <UnavailableBlock
              key={`${dayIndex}-${i}`}
              style={{
                left: dayIndex * columnWidth,
                width: columnWidth,
                top: pos.top,
                height: pos.height,
                borderRadius,
              }}
            />
          );
        });
      })}
    </>
  );
};

export default AvailabilityLayer;

const UnavailableBlock = styled.div`
  position: absolute;
  background-color: rgba(175, 175, 175, 0.3);
  pointer-events: none;
`;
