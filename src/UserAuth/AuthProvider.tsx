// AuthProvider.tsx (or wherever you keep it)
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/FirebaseConfig";
import { onAuthStateChanged, type User, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type AuthContextType = {
  user: User | null;
  approved: boolean;
  loading: boolean;
  logout: () => Promise<void>; // 👈 add logout
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  approved: false,
  loading: true,
  logout: async () => {}, // default no-op
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setApproved(false);
        setLoading(false);
        return;
      }

      try {
        const docSnap = await getDoc(doc(db, "users", currentUser.uid));
        setApproved(docSnap.exists() ? docSnap.data()?.approved : true);
      } catch (err) {
        console.error("Failed to fetch approval status:", err);
        setApproved(false);
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
    <AuthContext.Provider value={{ user, approved, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
