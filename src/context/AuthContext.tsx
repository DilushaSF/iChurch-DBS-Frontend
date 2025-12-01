import {createContext, useState, useEffect} from "react";
import type {ReactNode} from "react";
import {authUtils} from "../utils/authUtils";
import {tokenUtils} from "../utils/token";
import type {AuthContextType, User} from "../types/auth.types";
import {authAPI} from "../services/api";

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const storedToken = tokenUtils.getToken();
      const storedUser = tokenUtils.getUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
      tokenUtils.clearAuth();
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({email, password});
      const {user, token} = response.data;

      // Store in state
      setUser(user);
      setToken(token);

      authUtils.handleLoginSuccess(token, user);

      return {success: true};
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Login failed. Please try again.";
      return {success: false, error: errorMessage};
    }
  };

  // Register function
  const register = async (
    churchName: string,
    parishName: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await authAPI.register({
        churchName,
        parishName,
        email,
        password,
      });

      if (!response.data || !response.data.user || !response.data.token) {
        throw new Error("Invalid response from server");
      }

      const {user, token} = response.data;

      setUser(user);
      setToken(token);

      authUtils.handleLoginSuccess(token, user);

      return {success: true};
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Registration failed. Please try again.";
      return {success: false, error: errorMessage};
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    authUtils.handleLogout();
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
