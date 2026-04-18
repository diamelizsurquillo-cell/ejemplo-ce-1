import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const VALID_USERNAME = "Administrador";
const VALID_PASSWORD = "CanalEjecutivo";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("ce_auth") === "true";
  });
  const [user, setUser] = useState<string | null>(() => {
    return sessionStorage.getItem("ce_user");
  });

  const login = useCallback((username: string, password: string) => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsAuthenticated(true);
      setUser(username);
      sessionStorage.setItem("ce_auth", "true");
      sessionStorage.setItem("ce_user", username);
      return { success: true };
    }
    return { success: false, error: "Usuario o contraseña incorrectos" };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    sessionStorage.removeItem("ce_auth");
    sessionStorage.removeItem("ce_user");
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
