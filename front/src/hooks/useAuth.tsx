import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import fetchAPI from '../utils/fetch';

interface User {
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmedPassword: string) => Promise<void>;
  logout: () => void;
  deleteAccount: () => void;
  changePassword: (password: string, confirmedPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode; 
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await fetchAPI("/login/", {
        method: "POST",
        body: { email, password }
      });

      setUser(data);
      localStorage.setItem('user', JSON.stringify(data)); 
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, confirmedPassword: string) => {
    try {
      const data = await fetchAPI("/register/", {
        method: "POST",
        body: { email, password, confirmedPassword }
      });

      console.log("User registered:", data.username);
      await login(email, password);
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetchAPI("/logout/", {
        method: "POST",
      });

      setUser(null);
      localStorage.removeItem('user');
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const deleteAccount = async () => {
    try {
      await fetchAPI("/delete_account/", {
        method: "DELETE",
        body: { username: user?.username }
      });

      setUser(null);
      localStorage.removeItem('user');
      console.log("User account deleted successfully.");
    } catch (error) {
      console.error("Error during account deletion:", error);
    }
  }

  const changePassword = async (password: string, confirmedPassword: string) => {
    try {
      await fetchAPI("/change_password/", {
        method: "PATCH",
        body: { password, confirmedPassword }
      });

      console.log("Password changed successfully.");
    } catch (error) {
      console.error("Error during password change:", error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, deleteAccount, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
