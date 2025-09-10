import React, { createContext, useContext, useState } from "react";

type UserType = "aluno" | "validador" | null;
interface AuthContextType {
  user: UserType;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as any);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType>(null);

  const login = (username: string, password: string) => {
    if (username === "user" && password === "1234") {
      setUser("aluno");
    } else if (username === "validador" && password === "1234") {
      setUser("validador");
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
