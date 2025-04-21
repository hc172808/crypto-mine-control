
import React, { createContext, useState, useContext, useEffect } from "react";

type User = {
  id: string;
  username: string;
  email: string;
  name: string; // Add name property
  role: "admin" | "client"; // Change "user" role to "client"
  createdAt: string; // Add createdAt property
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user data in localStorage
    const storedUser = localStorage.getItem("miningUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login
      // with different roles based on the email
      const isAdmin = email.includes("admin");
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        username: email.split("@")[0],
        name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1), // Generate a name from username
        email,
        role: isAdmin ? "admin" : "client",
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem("miningUser", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("miningUser");
    setUser(null);
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful registration
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        username,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        email,
        role: "client",
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem("miningUser", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
