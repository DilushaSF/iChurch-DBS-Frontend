// src/context/AuthContext.tsx
import {createContext, useState, useContext, useEffect} from "react";
import type {ReactNode} from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{success: boolean; error?: string}>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{success: boolean; error?: string}>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function (will connect to backend later)
  const login = async (email: string, _password: string) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // Simulating login for now (password will be used when backend is connected)
      const mockUser: User = {
        id: 1,
        name: "Admin User",
        email: email,
        role: "admin",
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return {success: true};
    } catch (error) {
      return {success: false, error: (error as Error).message};
    }
  };

  // Register function (will connect to backend later)
  const register = async (name: string, email: string, _password: string) => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // (password will be used when backend is connected)
      const mockUser: User = {
        id: 1,
        name: name,
        email: email,
        role: "member",
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return {success: true};
    } catch (error) {
      return {success: false, error: (error as Error).message};
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
