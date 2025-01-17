import { useState, createContext, useContext, ReactNode } from 'react';
import fetchAPI from '../utils/fetch';

type AuthContextType = {
  isAuthenticated: boolean;
  authenticate: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmedPassword: string) => Promise<void>;
  logout: () => void;
  deleteAccount: () => void;
  changePassword: (password: string, confirmedPassword: string) => void;
  resetPassword: (password: string, confirmedPassword: string, uid: string, token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAutenticated] = useState(false);

  const authenticate = async () => {
    try {
      const data = await fetchAPI("/accounts/authenticate", {
        method: "GET",
      });

      setIsAutenticated(data.isAuthenticated);
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await fetchAPI("/accounts/login", {
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
      await fetchAPI("/accounts/register", {
        method: "POST",
        body: { email, password, confirmedPassword }
      });
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetchAPI("/accounts/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const deleteAccount = async () => {
    try {
      await fetchAPI("/accounts/delete-account", {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error during account deletion:", error);
    }
  };

  const changePassword = async (password: string, confirmedPassword: string) => {
    try {
      await fetchAPI("/accounts/change-password", {
        method: "PATCH",
        body: { password, confirmedPassword }
      });
    } catch (error) {
      console.error("Error during password change:", error);
    }
  };

  const resetPassword = async (password: string, confirmedPassword: string, uid: string, token: string) => {
    try {
      const response = await fetchAPI("/accounts/password-reset/done", {
        method: "POST",
        body: { password, confirmedPassword, uid, token }
      });
      return response;
    } catch (error) {
      console.error("Error during password reset:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, login, logout, register, deleteAccount, changePassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};