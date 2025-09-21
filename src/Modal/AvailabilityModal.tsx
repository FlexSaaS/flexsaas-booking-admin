import { useState } from "react";
import styled from "styled-components";
import { daysOfWeek, type DayAvailability } from "../types";

type Props = {
  onClose: () => void;
  onSave: (year: number, availability: DayAvailability[]) => void;
};

// Predefined time options in minutes from midnight
const timeOptions = Array.from({ length: 26 }, (_, i) => ({
  value: 480 + i * 30,
  label: `${Math.floor((480 + i * 30) / 60)}:${((480 + i * 30) % 60)
    .toString()
    .padStart(2, "0")}${480 + i * 30 < 720 ? "am" : "pm"}`,
}));

/**
 * Modal component to set weekly availability for a selected year.
 */
function AvailabilityModal({ onClose, onSave }: Props) {
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

  // Toggle day open/closed and reset default hours/staff
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

  // Update start or end time for a day
  const updateTime = (index: number, field: "start" | "end", value: number) => {
    setAvailability((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // Update number of staff for a day
  const updateStaff = (index: number, value: number) => {
    if (value < 1) return;
    setAvailability((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, staffCount: value } : item
      )
    );
  };

  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <Overlay>
      <Modal>
        <Title>Set Yearly Hours</Title>
        <Subtitle>
          Configure standard hours of operation for this location for the
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
          <SaveButton onClick={() => onSave(year, availability)}>
            Save Schedule
          </SaveButton>
        </ButtonsRow>
      </Modal>
    </Overlay>
  );
}

export default AvailabilityModal;

const YearSelector = styled.select`
  width: 120px;
  padding: 6px 8px;
  font-size: 1rem;
  margin-bottom: 24px;
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 6px;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
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
  background: ${({ theme }) => theme.background};
  border-radius: 10px;
  padding: 28px 36px;
`;

const Title = styled.h2`
  margin: 0 0 12px 0;
  font-weight: 700;
  font-size: 1.75rem;
  color: ${({ theme }) => theme.primary};
`;

const Subtitle = styled.p`
  margin: 0 0 24px 0;
  color: ${({ theme }) => theme.text};
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
  color: ${({ theme }) => theme.text};
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
    background-color: ${({ theme }) => theme.primary};
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
  background-color: ${({ theme }) => theme.border};
  border-radius: 24px;
  transition: 0.4s;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: ${({ theme }) => theme.background};
    border-radius: 50%;
    transition: 0.4s;
  }
`;

const ToggleText = styled.span`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text};
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
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  transition: border-color 0.2s;
  flex-shrink: 0;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
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
  color: ${({ theme }) => theme.text};
`;

const StaffInput = styled.input.attrs({ type: "number" })`
  width: 40px;
  font-size: 1rem;
  padding: 4px 6px;
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 6px;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
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
  background: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.text};
  padding: 10px 20px;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.border};
  }
`;

const SaveButton = styled.button`
  border: none;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.background};
  padding: 10px 24px;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.secondary};
  }
`;
