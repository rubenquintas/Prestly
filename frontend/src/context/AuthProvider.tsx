import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "../types";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const authValue = useMemo(
    () => ({
      user,
      loading,
      login: (token: string, newUser: User) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
      },
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      },
    }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={authValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
