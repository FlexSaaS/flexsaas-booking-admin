import { useEffect, useState } from "react";
import { db } from "../services/FirebaseConfig";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import styled from "styled-components";
import type { IEmailService } from "../types";
import { EmailJsService } from "../services/EmailJSService";

type PendingUser = {
  id: string; // UID
  email: string;
  approved: boolean;
  requestedAt: any;
};

// In future create a provider and surround the entire App.
const emailService: IEmailService = new EmailJsService();

function AdminDashboard() {
  const [users, setUsers] = useState<PendingUser[]>([]);

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const users: PendingUser[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (!data.approved) {
        users.push({
          id: docSnap.id,
          email: data.email,
          approved: data.approved,
          requestedAt: data.requestedAt,
        });
      }
    });
    setUsers(users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const approveUser = async (user: PendingUser) => {
    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, { approved: true });
      await emailService.sendApprovalEmail(user.email);
      fetchUsers();
    } catch (err) {
      console.error("Failed to approve user:", err);
    }
  };

  const rejectUser = async (user: PendingUser) => {
    try {
      const userRef = doc(db, "users", user.id);
      await deleteDoc(userRef);
      await emailService.sendRejectionEmail(user.email);
      fetchUsers();
    } catch (err) {
      console.error("Failed to reject user:", err);
    }
  };

  return (
    <Container>
      <Title>Pending Users</Title>
      {users.length === 0 ? (
        <Message>No pending users</Message>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Email</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.email}</Td>
                <Td>
                  <ActionButton onClick={() => approveUser(user)}>
                    Approve
                  </ActionButton>
                  <RejectButton onClick={() => rejectUser(user)}>
                    Reject
                  </RejectButton>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default AdminDashboard;


// Styled components
const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  font-family: system-ui, sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Message = styled.p`
  text-align: center;
  font-size: 16px;
  color: #666;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f9f9f9;
  }
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  margin-right: 8px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #45a049;
  }
`;

const RejectButton = styled(ActionButton)`
  background-color: #f44336;

  &:hover {
    background-color: #d32f2f;
  }
`;
