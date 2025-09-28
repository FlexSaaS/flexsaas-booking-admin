import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/FirebaseConfig";
import { onAuthStateChanged, type User, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type AuthContextType = {
  user: User | null;
  approved: boolean;
  businessName: string | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  approved: false,
  businessName: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [approved, setApproved] = useState(false);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setApproved(false);
        setBusinessName(null);
        setLoading(false);
        return;
      }

      try {
        const docSnap = await getDoc(doc(db, "users", currentUser.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setApproved(data?.approved ?? false);
          setBusinessName(data?.businessName ?? null);
        } else {
          setApproved(false);
          setBusinessName(null);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setApproved(false);
        setBusinessName(null);
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
      value={{ user, approved, businessName, loading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
