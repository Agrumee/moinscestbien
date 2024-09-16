import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { getCSRFCookie } from '../utils/cookies';

// Définition de l'interface pour l'utilisateur
interface User {
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmedPassword: string) => Promise<void>;

  logout: () => void;
}

// Création du contexte d'authentification
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte d'authentification
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
      const csrfResponse = await fetch("http://127.0.0.1:8000/api/csrf_cookie/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!csrfResponse.ok) {
        throw new Error("Failed to fetch CSRF token");
      }

      const loginResponse = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFCookie("csrftoken") || "",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await loginResponse.json();

      if (loginResponse.ok) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data)); 
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, confirmedPassword: string) => {
    try {
      const csrfResponse = await fetch("http://127.0.0.1:8000/api/csrf_cookie/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!csrfResponse.ok) {
        throw new Error("Failed to fetch CSRF token");
      }

      const registerResponse = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFCookie("csrftoken") || "",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          confirmedPassword,
        }),
      });

      const data = await registerResponse.json();

      if (registerResponse.ok) {
        console.log("User registered:", data.username);
        // Optionnel: Connecter l'utilisateur automatiquement après l'inscription
        await login(email, password);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const csrfResponse = await fetch("http://127.0.0.1:8000/api/csrf_cookie/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
  
      if (!csrfResponse.ok) {
        throw new Error("Failed to fetch CSRF token for logout");
      }
  
      const logoutResponse = await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFCookie("csrftoken") || "",
        },
        credentials: "include",
      });
  
      if (logoutResponse.ok) {
        // Supprimer l'utilisateur de l'état local
        setUser(null);
        // Supprimer l'utilisateur du localStorage
        localStorage.removeItem('user');
        console.log("User logged out successfully.");
      } else {
        const errorData = await logoutResponse.json();
        throw new Error(errorData.error || "Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
