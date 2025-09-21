import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/FirebaseConfig";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type AuthContextType = {
  user: User | null;
  approved: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  approved: false,
  loading: true,
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

  return (
    <AuthContext.Provider value={{ user, approved, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
