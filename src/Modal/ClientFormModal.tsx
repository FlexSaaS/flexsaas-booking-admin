import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import type { Client } from "../types";

type ClientFormModalProps = {
  clientDetails: Client;
  setClientDetails: (details: Client) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function ClientFormModal({
  clientDetails,
  setClientDetails,
  onClose,
  onSubmit,
}: ClientFormModalProps) {
  return (
    <ModalOverlay>
      <ModalContainer>
        <FormHeader>
          <BackButton onClick={onClose}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </BackButton>
          <h3>Client Information</h3>
          <div style={{ width: "24px" }}></div>
        </FormHeader>

        <Form onSubmit={onSubmit}>
          <FormGroup>
            <Label>
              <FontAwesomeIcon icon={faUser} />
              Full Name *
            </Label>
            <Input
              type="text"
              value={clientDetails.name}
              onChange={(e) =>
                setClientDetails({ ...clientDetails, name: e.target.value })
              }
              placeholder="Enter client's full name"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Email Address *</Label>
            <Input
              type="email"
              value={clientDetails.email}
              onChange={(e) =>
                setClientDetails({ ...clientDetails, email: e.target.value })
              }
              placeholder="client@example.com"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              value={clientDetails.phone}
              onChange={(e) =>
                setClientDetails({ ...clientDetails, phone: e.target.value })
              }
              placeholder="(123) 456-7890"
            />
          </FormGroup>

          <FormActions>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit">
              Continue to Time Selection
            </SubmitButton>
          </FormActions>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
}

// --- Styled Components ---

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

const ModalContainer = styled.div`
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
