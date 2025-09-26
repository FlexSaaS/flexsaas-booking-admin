import styled from "styled-components";
import type { Appointment } from "../types";

type EventModalProps = {
  event: Appointment;
  onClose: () => void;
  onDelete: (id: string) => void;
};

/**
 * EventModal displays details of a single appointment in a popup overlay.
 * Users can close the modal or delete the appointment.
 */
function EventModal({ event, onClose, onDelete }: EventModalProps) {
  const handleDelete = () => {
    onDelete(event.id);
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <ServiceIcon>📅</ServiceIcon>
          <h3>Appointment Details</h3>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <Content>
          <ClientSection>
            <SectionTitle>Client Information</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <Label>Name</Label>
                <Value>{event.client.name}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Email</Label>
                <Value>{event.client.email}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Phone</Label>
                <Value>{event.client.phone}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Service</Label>
                <Value>{event.service}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Note</Label>
                <Value>{event.notes?.trim() || "No additional notes"}</Value>
              </InfoItem>
            </InfoGrid>
          </ClientSection>

          <AppointmentSection>
            <SectionTitle>Appointment Details</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <Label>Date</Label>
                <Value>{event.date.toDateString()}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Time</Label>
                <Value>{event.time}</Value>
              </InfoItem>
            </InfoGrid>
          </AppointmentSection>

          {event.notes && (
            <NotesSection>
              <SectionTitle>Notes</SectionTitle>
              <NotesText>{event.notes}</NotesText>
            </NotesSection>
          )}
        </Content>

        <Actions>
          <DeleteButton onClick={handleDelete}>Delete Event</DeleteButton>
          <CloseBtn onClick={onClose}>Close</CloseBtn>
        </Actions>
      </Modal>
    </Overlay>
  );
}

export default EventModal;

// Styled components
const Overlay = styled.div`
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
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Modal = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 0;
  border-radius: 16px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.9);
  overflow: hidden;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const Header = styled.div`
  background: ${({ theme }) => theme.primary};
  padding: 1.5rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;

  h3 {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 600;
    flex: 1;
  }
`;

const ServiceIcon = styled.div`
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.8rem;
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

const Content = styled.div`
  padding: 1.5rem;
`;

const SectionTitle = styled.h4`
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1rem 0;
`;

const ClientSection = styled.div`
  margin-bottom: 1.5rem;
`;

const AppointmentSection = styled.div`
  margin-bottom: 1.5rem;
`;

const NotesSection = styled.div`
  margin-bottom: 1rem;
`;

const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
`;

const Label = styled.span`
  font-weight: 500;
  color: #64748b;
  min-width: 80px;
  font-size: 0.9rem;
`;

const Value = styled.span`
  color: #1e293b;
  font-weight: 500;
  flex: 1;
  text-align: right;
`;

const NotesText = styled.p`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  margin: 0;
  color: #475569;
  line-height: 1.5;
`;

const Actions = styled.div`
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ButtonBase = styled.button`
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
`;

const CloseBtn = styled(ButtonBase)`
  background: ${({ theme }) => theme.primary};
  color: white;
  &:hover {
    background: ${({ theme }) => theme.secondary};
    transform: translateY(-1px);
  }
`;

const DeleteButton = styled(ButtonBase)`
  background: #ff4d4f;
  color: white;
  &:hover {
    background: #d9363e;
    transform: translateY(-1px);
  }
`;

