import styled from "styled-components";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 1rem;
  color: black;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Dropdown = styled.select`
  padding: 0.3rem;
  border-radius: 4px;
`;

type MainHeaderProps = {
  month: number;
  year: number;
  setMonth: (m: number) => void;
  setYear: (y: number) => void;
  view: "Day" | "Week" | "Month";
  setView: (v: "Day" | "Week" | "Month") => void;
};

export function MainHeader({
  month,
  year,
  setMonth,
  setYear,
  view,
  setView,
}: MainHeaderProps) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const goToToday = () => {
    const today = new Date();
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  };

  const goToPrevious = () => {
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  const goToNext = () => {
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setView(e.target.value as "Day" | "Week" | "Month");
  };

  return (
    <Header>
      <Button onClick={goToToday}>Today</Button>
      <Controls>
        <Button onClick={goToPrevious}>←</Button>
        <div>
          {monthNames[month]} {year}
        </div>
        <Button onClick={goToNext}>→</Button>
      </Controls>

      <Dropdown value={view} onChange={handleViewChange}>
        <option value="Day">Day</option>
        <option value="Week">Week</option>
        <option value="Month">Month</option>
      </Dropdown>
    </Header>
  );
}
