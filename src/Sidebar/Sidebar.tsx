import { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faUser, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SmallCalendar from "./Components/SmallCalendar";
import Appointment from "../Modal/CreateAppointmentModal";
import AvailabilityModal from "../Modal/AvailabilityModal";
import type { AvailabilityType, DayAvailability, Client } from "../types";
import { ThemeSwitch } from "./Components/ThemeSwitch";
import { useAuth } from "../UserAuth/AuthProvider";

type SidebarProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  availability: AvailabilityType[];
  onSaveAvailability: (year: number, availability: DayAvailability[]) => void;
  onTimeSelected: (time: string, date: Date, client: Client) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
};

function Sidebar({ selectedDate, setSelectedDate, onSaveAvailability, onTimeSelected, availability, darkMode, setDarkMode }: SidebarProps) {
  const [showAvailModal, setShowAvailModal] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientDetails, setClientDetails] = useState<Client>({
    name: "",
    email: "",
    phone: "",
  });

  const { logout } = useAuth();

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
    setClientDetails({ name: "", email: "", phone: "" });
  };

  const handleAppointmentClose = () => {
    setShowAppointment(false);
    // Reset client details when appointment modal closes
    setClientDetails({ name: "", email: "", phone: "" });
  };

  const handleTimeSelected = (time: string, date: Date) => {
    onTimeSelected(time, date, clientDetails);
  };

  return (
    <SidebarContainer>
      <div>
        <TopSection>
          <FontAwesomeIcon icon={faCalendar} />
          <span>Calendar</span>
        </TopSection>

        <SmallCalendar selectedDate={selectedDate} onSelectDate={(date) => setSelectedDate(date)} />

        <Button onClick={() => setShowAvailModal(true)}>Set Availability</Button>

        <Button onClick={handleBookAppointmentClick}>Book Appointment</Button>

        <Button onClick={logout}>Log Out</Button>
        <ThemeWrapper>
          <ThemeSwitch checked={!darkMode} onChange={() => setDarkMode(!darkMode)} />
        </ThemeWrapper>

        {/* Client Details Form Modal */}
        {showClientForm && (
          <ModalOverlay>
            <ClientFormModal>
              <FormHeader>
                <BackButton onClick={handleClientFormClose}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </BackButton>
                <h3>Client Information</h3>
                <div style={{ width: "24px" }}></div> {/* Spacer for balance */}
              </FormHeader>

              <Form onSubmit={handleClientFormSubmit}>
                <FormGroup>
                  <Label>
                    <FontAwesomeIcon icon={faUser} />
                    Full Name *
                  </Label>
                  <Input
                    type="text"
                    value={clientDetails.name}
                    onChange={(e) => setClientDetails({ ...clientDetails, name: e.target.value })}
                    placeholder="Enter client's full name"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    value={clientDetails.email}
                    onChange={(e) => setClientDetails({ ...clientDetails, email: e.target.value })}
                    placeholder="client@example.com"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={clientDetails.phone}
                    onChange={(e) => setClientDetails({ ...clientDetails, phone: e.target.value })}
                    placeholder="(123) 456-7890"
                  />
                </FormGroup>

                <FormActions>
                  <CancelButton type="button" onClick={handleClientFormClose}>
                    Cancel
                  </CancelButton>
                  <SubmitButton type="submit">Continue to Time Selection</SubmitButton>
                </FormActions>
              </Form>
            </ClientFormModal>
          </ModalOverlay>
        )}

        {/* Appointment Time Selection Modal */}
        {showAppointment && <Appointment onClose={handleAppointmentClose} availableTimes={availability} onTimeSelected={handleTimeSelected} />}

        {showAvailModal && <AvailabilityModal onClose={() => setShowAvailModal(false)} onSave={onSaveAvailability} />}
      </div>
    </SidebarContainer>
  );
}

export default Sidebar;

// Styled components
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

const ThemeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  margin-top: 1.5rem;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  background: ${({ theme }) => theme.secondary};
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 1px 2px ${({ theme }) => theme.secondary};
  transition: background-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.background};
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

// New styled components for the client form modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ClientFormModal = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 16px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
`;

const FormHeader = styled.div`
  background: ${({ theme }) => theme.primary};
  padding: 1.5rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 600;
  }
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const Form = styled.form`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.text}80;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.border};
  }
`;

const SubmitButton = styled.button`
  flex: 2;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.primary};
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
