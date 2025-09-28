import { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import SmallCalendar from "./Components/SmallCalendar";
import Appointment from "../Modal/CreateAppointmentModal";
import AvailabilityModal from "../Modal/AvailabilityModal";
import type { AvailabilityType, DayAvailability, Client } from "../types";
import { ThemeSwitch } from "./Components/ThemeSwitch";
import { useAuth } from "../UserAuth/AuthProvider";
import ClientFormModal from "../Modal/ClientFormModal";

type SidebarProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  availability: AvailabilityType[];
  onSaveAvailability: (year: number, availability: DayAvailability[]) => void;
  onTimeSelected: (time: string, date: Date, client: Client) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
};

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
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientDetails, setClientDetails] = useState<Client>({
    name: "",
    email: "",
    phone: "",
    service: "",
    notes: "",
  });

  const { businessName, logout } = useAuth();

  const handleBookAppointmentClick = () => {
    setShowClientForm(true);
  };

  const handleClientFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!clientDetails.name.trim() || !clientDetails.email.trim()) {
      alert("Please fill in at least name and email fields");
      return;
    }
    setShowClientForm(false);
    setShowAppointment(true);
  };

  const handleClientFormClose = () => {
    setShowClientForm(false);
    setClientDetails({ name: "", email: "", phone: "", service: "" });
  };

  const handleAppointmentClose = () => {
    setShowAppointment(false);
    // Reset client details when appointment modal closes
    setClientDetails({
      name: "",
      email: "",
      phone: "",
      service: "",
      notes: "",
    });
  };

  const handleTimeSelected = (time: string, date: Date) => {
    onTimeSelected(time, date, clientDetails);
  };

  return (
    <SidebarContainer>
      <div>
        <TopSection>
          <FontAwesomeIcon icon={faCalendar} />
          <span>
            {businessName ? `${businessName}'s Calendar` : "Calendar"}
          </span>
        </TopSection>

        <Section>
          <SmallCalendar
            selectedDate={selectedDate}
            onSelectDate={(date) => setSelectedDate(date)}
          />

          <Button onClick={() => setShowAvailModal(true)}>
            Set Availability
          </Button>
          <Button onClick={handleBookAppointmentClick}>Book Appointment</Button>
          <DangerButton onClick={logout}>Log Out</DangerButton>
        </Section>
      </div>

      <ThemeWrapper>
        <ThemeSwitch
          checked={!darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </ThemeWrapper>

      {/* Client Details Form Modal */}
      {showClientForm && (
        <ClientFormModal
          clientDetails={clientDetails}
          setClientDetails={setClientDetails}
          onClose={handleClientFormClose}
          onSubmit={handleClientFormSubmit}
        />
      )}

      {/* Appointment Time Selection Modal */}
      {showAppointment && (
        <Appointment
          onClose={handleAppointmentClose}
          availableTimes={availability}
          onTimeSelected={handleTimeSelected}
        />
      )}

      {showAvailModal && (
        <AvailabilityModal
          onClose={() => setShowAvailModal(false)}
          onSave={onSaveAvailability}
        />
      )}
    </SidebarContainer>
  );
}

export default Sidebar;

const SidebarContainer = styled.div`
  width: 280px;
  color: ${({ theme }) => theme.text};
  padding: 1.5rem 1.25rem;
  box-shadow: inset -1px 0 0 ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  user-select: none;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid ${({ theme }) => theme.border};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ThemeWrapper = styled.div`
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  background: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.primary};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const DangerButton = styled(Button)`
  background: #e63947b0;
  color: #fff;

  &:hover {
    background: #d62828;
  }
`;
