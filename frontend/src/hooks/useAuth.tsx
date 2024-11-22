import { useState, createContext, useContext, ReactNode } from 'react';
import fetchAPI from '../utils/fetch';


interface AuthContextType {
  isAuthenticated: boolean;
  authenticate: () => void;
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
  const [isAuthenticated, setIsAutenticated] = useState(false);

  const authenticate = async () => {
    try {
      const data = await fetchAPI("/authenticate/", {
        method: "GET",
      });

      setIsAutenticated(data.isAuthenticated);
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  }

  const login = async (email: string, password: string) => {
    try {
      await fetchAPI("/csrf_cookie/", {
        method: "GET",
      });

      await fetchAPI("/login/", {
        method: "POST",
        body: { email, password }
      });


    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, confirmedPassword: string) => {
    try {
      await fetchAPI("/csrf_cookie/", {
        method: "GET",
      });

      await fetchAPI("/register/", {
        method: "POST",
        body: { email, password, confirmedPassword }
      });

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

      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const deleteAccount = async () => {
    try {
      await fetchAPI("/delete_account/", {
        method: "DELETE",
      });

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
    <AuthContext.Provider value={{isAuthenticated, authenticate, login, logout, register, deleteAccount, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
