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
    <Overlay>
      <Modal>
        <h3>{event.service}</h3>
        <p>Client: {event.client.name}</p>
        <p>Email: {event.client.email}</p>
        <p>Phone: {event.client.phone}</p>
        <p>Date: {event.date.toDateString()}</p>
        <p>Time: {event.time}</p>
        <p>Notes: {event.notes}</p>

        <Actions>
          <button onClick={handleDelete}>Delete Event</button>
          <button onClick={onClose}>Close</button>
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
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const Actions = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;
