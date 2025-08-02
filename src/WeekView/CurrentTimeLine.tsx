import styled from "styled-components";

type Props = {
  top: number;
  col: number;
};

const CurrentTimeLine = ({ top, col }: Props) => (
  <StyledLine
    style={{
      top,
      gridColumnStart: col,
      gridColumnEnd: col + 1,
    }}
  />
);

export default CurrentTimeLine;

const StyledLine = styled.div`
  position: absolute;
  height: 2px;
  background-color: ${({ theme }) => theme.primary};
  z-index: 10;
  pointer-events: none;
  left: 0;
  right: 0;
`;
