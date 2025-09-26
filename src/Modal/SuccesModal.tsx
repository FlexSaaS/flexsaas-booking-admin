import React, { useEffect } from 'react';
import styled from 'styled-components';
import type { Appointment } from '../types';

interface SuccessModalProps {
  appointment: Appointment;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ appointment, onClose }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>Appointment Saved!</ModalTitle>
        <ModalMessage>
          Appointment for <strong>{appointment.client.name}</strong> for{' '}
          <strong>{appointment.service}</strong> on{' '}
          <strong>{appointment.date.toLocaleDateString()}</strong> at{' '}
          <strong>{appointment.time}</strong> has been successfully saved.
        </ModalMessage>
        <ModalButton onClick={onClose}>OK</ModalButton>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; 
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
  z-index: 10000; 
  animation: slideUp 0.3s ease-out;
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ModalTitle = styled.h3`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.primary};
  font-size: 1.5rem;
`;

const ModalMessage = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const ModalButton = styled.button`
  background-color: green;
  color: ${({ theme }) => theme.text};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s;
  &:hover {
    background-color: ${({ theme }) => theme.primary};
    transform: scale(1.02);
  }
`;
