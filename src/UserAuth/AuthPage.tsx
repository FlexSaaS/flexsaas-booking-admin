import { useState } from "react";
import { auth, db } from "../services/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import styled from "styled-components";
import type { IEmailService } from "../types";
import { EmailJsService } from "../services/EmailJSService";

// In future create a provider and surround the entire App.
const emailService: IEmailService = new EmailJsService();

function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await setDoc(doc(db, "users", userCredential.user.uid), {
          email,
          approved: false,
          requestedAt: serverTimestamp(),
        });

        await emailService.sendRegistrationPendingEmail(email);
        await emailService.notifyAdminOfRegistration(email);

        setMessage("✅ Registration submitted. Pending admin approval.");
        setIsRegister(false);
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const docSnap = await getDoc(doc(db, "users", userCredential.user.uid));
        const approved = docSnap.exists() ? docSnap.data()?.approved : true;

        if (!approved) {
          setMessage("⚠️ Your account is pending approval by admin.");
          await auth.signOut();
          return;
        }

        setMessage(`✅ Welcome ${userCredential.user.email}`);
        console.log("Logged in:", userCredential.user);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>{isRegister ? "Register" : "Login"}</Title>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">{isRegister ? "Register" : "Login"}</Button>
        {message && <Message error={message.includes("❌")}>{message}</Message>}
      </Form>

      <ToggleText>
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <ToggleButton type="button" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Login" : "Register"}
        </ToggleButton>
      </ToggleText>
    </Container>
  );
}

export default AuthPage;


// Styled components
const Container = styled.div`
  max-width: 400px;
  margin: 50px auto;
  text-align: center;
  font-family: system-ui, sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #45a049;
  }
`;

const Message = styled.p<{ error?: boolean }>`
  margin-top: 10px;
  color: ${({ error }) => (error ? "red" : "green")};
`;

const ToggleText = styled.p`
  margin-top: 20px;
`;

const ToggleButton = styled.button`
  text-decoration: underline;
  background: none;
  border: none;
  color: blue;
  cursor: pointer;
`;
