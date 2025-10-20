import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/FirebaseConfig";
import { onAuthStateChanged, type User, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
 
type AuthContextType = {
  user: User | null;
  approved: boolean;
  businessName: string | null;
  role: string | null; // <-- add role
  loading: boolean;
  logout: () => Promise<void>;
};
 
const AuthContext = createContext<AuthContextType>({
  user: null,
  approved: false,
  businessName: null,
  role: null,
  loading: true,
  logout: async () => {},
});
 
export const useAuth = () => useContext(AuthContext);
 
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [approved, setApproved] = useState(false);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // <-- track role
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
 
      if (!currentUser) {
        setApproved(false);
        setBusinessName(null);
        setRole(null);
        setLoading(false);
        return;
      }
 
      try {
        const docSnap = await getDoc(doc(db, "users", currentUser.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setApproved(data?.approved ?? false);
          setBusinessName(data?.businessName ?? null);
          setRole(data?.role ?? null); // <-- pull role field
        } else {
          setApproved(false);
          setBusinessName(null);
          setRole(null);
        } else {
          setApproved(false);
          setBusinessName(null);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setApproved(false);
        setBusinessName(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    });
 
    return () => unsubscribe();
  }, []);
 
  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
 
  return (
<AuthContext.Provider
      value={{ user, approved, businessName, role, loading, logout }}
>
    <AuthContext.Provider
      value={{ user, approved, businessName, loading, logout }}
    >
      {children}
</AuthContext.Provider>
  );
}