import React from "react";
import styled from "styled-components";
import type { AvailabilityType } from "../types";

type AvailabilityLayerProps = {
  gridWidth: number;
  gridHeight: number;
  daysCount: number;
  availability: AvailabilityType[];
  startOfWeek: Date;
};

const START_MINUTES = 8 * 60;
const END_MINUTES = 21 * 60;

const toMinutes = (date: Date) => date.getHours() * 60 + date.getMinutes();

const AvailabilityLayer: React.FC<AvailabilityLayerProps> = ({
  gridWidth,
  gridHeight,
  daysCount,
  availability,
  startOfWeek,
}) => {
  const columnWidth = gridWidth / daysCount;
  const totalMinutes = END_MINUTES - START_MINUTES;

  const availabilityByDay = new Map<number, { start: Date; end: Date }>();

  availability.forEach((entry) => {
    if (entry.times.length > 0) {
      const firstMinutes = entry.times[0];
      const lastMinutes = entry.times[entry.times.length - 1];

      const start = new Date(entry.date);
      start.setHours(Math.floor(firstMinutes / 60), firstMinutes % 60, 0, 0);

      const end = new Date(entry.date);
      end.setHours(Math.floor(lastMinutes / 60), lastMinutes % 60, 0, 0);

      const dayIndex = Math.floor(
        (entry.date.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayIndex >= 0 && dayIndex < daysCount) {
        availabilityByDay.set(dayIndex, { start, end });
      }
    }
  });

  return (
    <>
      {Array.from({ length: daysCount }, (_, dayIndex) => {
        const slot = availabilityByDay.get(dayIndex);
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
