import { useState } from "react";
import styled from "styled-components";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type DayAvailability = {
  day: string;
  isOpen: boolean;
  start: number;
  end: number;
  staffCount: number;
};

type Props = {
  onClose: () => void;
  onSave: (data: { date: Date; times: number[]; staffCount: number }[]) => void;
};

const timeOptions = [
  { value: 480, label: "8:00am" },
  { value: 510, label: "8:30am" },
  { value: 540, label: "9:00am" },
  { value: 570, label: "9:30am" },
  { value: 600, label: "10:00am" },
  { value: 630, label: "10:30am" },
  { value: 660, label: "11:00am" },
  { value: 690, label: "11:30am" },
  { value: 720, label: "12:00pm" },
  { value: 750, label: "12:30pm" },
  { value: 780, label: "1:00pm" },
  { value: 810, label: "1:30pm" },
  { value: 840, label: "2:00pm" },
  { value: 870, label: "2:30pm" },
  { value: 900, label: "3:00pm" },
  { value: 930, label: "3:30pm" },
  { value: 960, label: "4:00pm" },
  { value: 990, label: "4:30pm" },
  { value: 1020, label: "5:00pm" },
  { value: 1050, label: "5:30pm" },
  { value: 1080, label: "6:00pm" },
  { value: 1110, label: "6:30pm" },
  { value: 1140, label: "7:00pm" },
  { value: 1170, label: "7:30pm" },
  { value: 1200, label: "8:00pm" },
  { value: 1230, label: "8:30pm" },
  { value: 1260, label: "9:00pm" },
];

export default function AvailabilityModal({ onClose, onSave }: Props) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const [availability, setAvailability] = useState<DayAvailability[]>(
    daysOfWeek.map((day) => ({
      day,
      isOpen: false,
      start: 540,
      end: 1020,
      staffCount: 0,
    }))
  );

  const toggleOpen = (index: number) => {
    setAvailability((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              isOpen: !item.isOpen,
              staffCount: !item.isOpen ? 1 : 0,
              start: !item.isOpen ? 540 : item.start,
              end: !item.isOpen ? 1020 : item.end,
            }
          : item
      )
    );
  };

  const updateTime = (index: number, field: "start" | "end", value: number) => {
    setAvailability((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const updateStaff = (index: number, value: number) => {
    if (value < 1) return;
    setAvailability((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, staffCount: value } : item
      )
    );
  };

  function getAllDatesInYear(year: number): Date[] {
    const dates = [];
    const date = new Date(year, 0, 1);

    while (date.getFullYear() === year) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  }

  function generateTimesAsNumbers(start: number, end: number): number[] {
    const times: number[] = [];
    for (let time = start; time <= end; time += 30) {
      times.push(time);
    }
    return times;
  }

  function generateAvailableTimesForYear(
    year: number,
    availability: DayAvailability[]
  ): { date: Date; times: number[]; staffCount: number }[] {
    const datesInYear = getAllDatesInYear(year);
    const availabilityMap = new Map(availability.map((a) => [a.day, a]));

    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize today's date to midnight

    return datesInYear
      .filter((date) => {
        const dateCopy = new Date(date);
        dateCopy.setHours(0, 0, 0, 0);
        return dateCopy >= today;
      })
      .map((date) => {
        const dayName = daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1];
        const dayAvailability = availabilityMap.get(dayName);

        if (dayAvailability && dayAvailability.isOpen) {
          // Generate all times from start to end
          const times = generateTimesAsNumbers(
            dayAvailability.start,
            dayAvailability.end
          );

          // Exclude last 30 minutes before closing
          const maxTime = dayAvailability.end - 30; // subtract 30 mins
          const filteredTimes = times.filter((t) => t <= maxTime);

          return {
            date,
            times: filteredTimes,
            staffCount: dayAvailability.staffCount,
          };
        }

        return null;
      })
      .filter(Boolean) as { date: Date; times: number[]; staffCount: number }[];
  }

  const handleSave = () => {
    const fullAvailability = generateAvailableTimesForYear(year, availability);
    onSave(fullAvailability);
    onClose();
  };

  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <Overlay>
      <Modal>
        <Title>Set Yearly Hours</Title>
        <Subtitle>
          Configure the standard hours of operation for this location for the
          selected year.
        </Subtitle>

        <YearSelector
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          aria-label="Select year"
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </YearSelector>

        {availability.map(({ day, isOpen, start, end, staffCount }, idx) => (
          <DayRow key={day}>
            <DayName>{day}</DayName>
            <ToggleLabel>
              <ToggleInput checked={isOpen} onChange={() => toggleOpen(idx)} />
              <Slider />
            </ToggleLabel>
            <ToggleText>{isOpen ? "Open" : "Closed"}</ToggleText>

            {isOpen && (
              <>
                <TimeSelect
                  value={start}
                  onChange={(e) =>
                    updateTime(idx, "start", Number(e.target.value))
                  }
                >
                  {timeOptions.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </TimeSelect>

                <span>to</span>

                <TimeSelect
                  value={end}
                  onChange={(e) =>
                    updateTime(idx, "end", Number(e.target.value))
                  }
                >
                  {timeOptions.map(({ value, label }) => (
                    <option key={value} value={value} disabled={value <= start}>
                      {label}
                    </option>
                  ))}
                </TimeSelect>

                <StaffWrapper>
                  <StaffLabel htmlFor={`staff-${idx}`}>
                    Available Staff
                  </StaffLabel>
                  <StaffInput
                    id={`staff-${idx}`}
                    value={staffCount}
                    min={1}
                    onChange={(e) => updateStaff(idx, Number(e.target.value))}
                    title="Number of Staff"
                  />
                </StaffWrapper>
              </>
            )}
          </DayRow>
        ))}

        <ButtonsRow>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SaveButton onClick={handleSave}>Save Schedule</SaveButton>
        </ButtonsRow>
      </Modal>
    </Overlay>
  );
}

const YearSelector = styled.select`
  width: 120px;
  padding: 6px 8px;
  font-size: 1rem;
  margin-bottom: 24px;
  border: 1.5px solid #ccc;
  border-radius: 6px;

  &:focus {
    border-color: #5a4de1;
    outline: none;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 10px;
  padding: 28px 36px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
`;

const Title = styled.h2`
  margin: 0 0 12px 0;
  font-weight: 700;
  font-size: 1.75rem;
  color: #4f64ed;
`;

const Subtitle = styled.p`
  margin: 0 0 24px 0;
  color: #555;
  font-size: 1rem;
  line-height: 1.3;
`;

const DayRow = styled.div`
  display: flex;
  align-items: center;
  margin: 14px 0;
  gap: 12px;
  flex-wrap: nowrap;
  min-height: 36px;
`;
const DayName = styled.div`
  flex: 0 0 100px;
  font-weight: 600;
  font-size: 1rem;
  color: #222;
`;
const ToggleLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  margin-right: 8px;
  cursor: pointer;
  flex-shrink: 0;
  vertical-align: middle;
`;

const ToggleInput = styled.input.attrs({ type: "checkbox" })`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #5a4de1;
  }
  &:checked + span:before {
    transform: translateX(20px);
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 24px;
  transition: 0.4s;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
  }
`;

const ToggleText = styled.span`
  font-size: 0.95rem;
  color: #444;
  user-select: none;
  min-width: 45px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const TimeSelect = styled.select`
  width: 90px;
  padding: 6px 8px;
  font-size: 0.9rem;
  margin: 0 8px;
  border: 1.5px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.2s;
  flex-shrink: 0;

  &:focus {
    border-color: #5a4de1;
    outline: none;
  }
`;

const StaffWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 16px;
`;

const StaffLabel = styled.label`
  font-size: 0.9rem;
  color: #555;
`;

const StaffInput = styled.input.attrs({ type: "number" })`
  width: 40px;
  font-size: 1rem;
  padding: 4px 6px;
  border: 1.5px solid #ccc;
  border-radius: 6px;

  &:focus {
    border-color: #5a4de1;
    outline: none;
  }
`;

const ButtonsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 28px;
  gap: 12px;
`;

const CancelButton = styled.button`
  border: none;
  background: #ddd;
  color: #333;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #bbb;
  }
`;

const SaveButton = styled.button`
  border: none;
  background: #5a4de1;
  color: white;
  padding: 10px 24px;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #433db9;
  }
`;
