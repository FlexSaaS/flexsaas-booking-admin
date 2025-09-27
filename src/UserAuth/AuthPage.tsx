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

const emailService: IEmailService = new EmailJsService();

function AuthPage() {
  const [businessName, setBusinessName] = useState(""); 
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
          businessName,
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
        {isRegister && (
          <Input
            type="text"
            placeholder="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
        )}
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

// ---------------- Styled Components ----------------

const Container = styled.div`
  max-width: 500px;
  margin: 80px auto;
  text-align: center;
  font-family: system-ui, sans-serif;
  background-color: #f9f9f9;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin-bottom: 24px;
  color: #1a73e8;
  font-size: 1.8rem;
`;

const Input = styled.input`
  width: 94%;
  padding: 12px 14px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    border-color: #e8f0fe;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  margin-top: 14px;
  background-color: #1a73e8;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: #a8c7fa;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    background-color: #a8c7fa;
  }
`;

const Message = styled.p<{ error?: boolean }>`
  margin-top: 12px;
  font-size: 0.95rem;
  color: ${(props) => (props.error ? "#d32f2f" : "#388e3c")};
`;

const ToggleText = styled.p`
  margin-top: 24px;
  font-size: 0.95rem;
  color: #333;
`;

const ToggleButton = styled.button`
  text-decoration: underline;
  background: none;
  border: none;
  color: #1a73e8;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    color: #a8c7fa;
  }
`;
