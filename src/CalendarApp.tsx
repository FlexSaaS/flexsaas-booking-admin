import styled from "styled-components";
import { useState } from "react";
import { MainHeader } from "./MainHeader";
import DayView from "./DayView";
import WeekView from "./WeekView";
import MonthView from "./MonthView";

function CalendarApp() {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [view, setView] = useState<"Day" | "Week" | "Month">("Month");

  let ViewComponent;
  switch (view) {
    case "Day":
      ViewComponent = <DayView />;
      break;
    case "Week":
      ViewComponent = <WeekView />;
      break;
    case "Month":
      ViewComponent = <MonthView />;
      break;
  }

  return (
    <MainContainer>
      <MainHeader
        month={month}
        year={year}
        setMonth={setMonth}
        setYear={setYear}
        view={view}
        setView={setView}
      />
      {ViewComponent}
    </MainContainer>
  );
}

export default CalendarApp;

const MainContainer = styled.div`
  flex: 1;
  /* background-color: grey; */
  display: flex;
  flex-direction: column;
`;
