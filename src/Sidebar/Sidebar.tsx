import { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import SmallCalendar from "./Components/SmallCalendar";
import Appointment from "../Modal/CreateAppointmentModal";
import AvailabilityModal from "../Modal/AvailabilityModal";
import type { AvailabilityType, DayAvailability } from "../types";
import { ThemeSwitch } from "./Components/ThemeSwitch";

type SidebarProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  availability: AvailabilityType[];
  onSaveAvailability: (year: number, availability: DayAvailability[]) => void;
  onTimeSelected: (time: string, date: Date) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
};

/**
 * Sidebar component with calendar, availability, appointment booking, and theme toggle
 */
function Sidebar({
  selectedDate,
  setSelectedDate,
  onSaveAvailability,
  onTimeSelected,
  availability,
  darkMode,
  setDarkMode,
}: SidebarProps) {
  const [showAvailModal, setShowAvailModal] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);

  return (
    <SidebarContainer>
      <div>
        <TopSection>
          <FontAwesomeIcon icon={faCalendar} />
          <span>Calendar</span>
        </TopSection>

        <SmallCalendar
          selectedDate={selectedDate}
          onSelectDate={(date) => setSelectedDate(date)}
        />

        <Button onClick={() => setShowAvailModal(true)}>
          Set Availability
        </Button>
        <Button onClick={() => setShowAppointment(true)}>
          Book Appointment
        </Button>

        <ThemeSwitch
          checked={!darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />

        {showAppointment && (
          <Appointment
            onClose={() => setShowAppointment(false)}
            availableTimes={availability}
            onTimeSelected={onTimeSelected}
          />
        )}

        {showAvailModal && (
          <AvailabilityModal
            onClose={() => setShowAvailModal(false)}
            onSave={onSaveAvailability}
          />
        )}
      </div>
    </SidebarContainer>
  );
}

export default Sidebar;

const SidebarContainer = styled.div`
  width: 280px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 1.25rem 1.5rem;
  box-shadow: inset -1px 0 0 ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  user-select: none;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  margin-top: 1.5rem;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  background: white;
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 1px 2px ${({ theme }) => theme.secondary};
  transition: background-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.secondary};
    box-shadow: 0 2px 6px ${({ theme }) => theme.primary};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }

  &:active {
    background-color: ${({ theme }) => theme.background};
  }
`;
