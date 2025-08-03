import styled, { css } from "styled-components";

type Props = {
  daysLength: number;
  hoursLength: number;
};

const TimeSlotsGrid = ({ daysLength, hoursLength }: Props) => (
  <>
    {Array.from({ length: daysLength }).map((_, colIdx) =>
      Array.from({ length: hoursLength }).map((_, rowIdx) => (
        <TimeSlot
          key={`${colIdx}-${rowIdx}`}
          data-timeslot
          isFirstRow={rowIdx === 0}
          isFirstCol={colIdx === 0}
          isLastRow={rowIdx === hoursLength - 1}
          isLastCol={colIdx === daysLength - 1}
          style={{
            gridColumn: colIdx + 1,
            gridRow: rowIdx + 1,
          }}
        />
      ))
    )}
  </>
);

export default TimeSlotsGrid;

const TimeSlot = styled.div<{
  isFirstRow: boolean;
  isFirstCol: boolean;
  isLastRow: boolean;
  isLastCol: boolean;
}>`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  border-right: 1px solid ${({ theme }) => theme.border};
  box-sizing: border-box;

  ${({ isFirstRow, theme }) =>
    isFirstRow &&
    css`
      border-top: 1px solid ${theme.border};
    `}

  ${({ isFirstCol, theme }) =>
    isFirstCol &&
    css`
      border-left: 1px solid ${theme.border};
    `}
  
    ${({ isLastRow, theme }) =>
    isLastRow &&
    css`
      border-bottom: 1px solid ${theme.border};
    `}
  
    ${({ isLastCol, theme }) =>
    isLastCol &&
    css`
      border-right: 1px solid ${theme.border};
    `}
  
    ${({ isFirstRow, isFirstCol }) =>
    isFirstRow &&
    isFirstCol &&
    css`
      border-top-left-radius: 8px;
    `}
  
    ${({ isFirstRow, isLastCol }) =>
    isFirstRow &&
    isLastCol &&
    css`
      border-top-right-radius: 8px;
    `}
  
    ${({ isLastRow, isFirstCol }) =>
    isLastRow &&
    isFirstCol &&
    css`
      border-bottom-left-radius: 8px;
    `}
  
    ${({ isLastRow, isLastCol }) =>
    isLastRow &&
    isLastCol &&
    css`
      border-bottom-right-radius: 8px;
    `}
`;
