import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Logged from "./layouts/Logged";
import Unlogged from "./layouts/Unlogged";
import Home from "./pages/Home";
import Profile from "./pages/Profile/Profile";
import AddNew from "./pages/AddNew";
import Login from "./pages/Auth/Login/Login";
import ResetPasswordForm from "./pages/Auth/ResetPasswordForm/ResetPasswordForm";
import WelcomingPage from "./pages/WelcomingPage/WelcomingPage";
import Register from "./pages/Auth/Register/Register";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import DeleteAccount from "./pages/DeleteAccount/DeleteAccount";
import PausedTracking from "./pages/PausedTracking";
import "./App.css";

const LayoutManager: React.FC = () => {
  const { authenticate, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      await authenticate();
      if (!isAuthenticated) {
        if (!['/', '/login', '/register', "/reset-password-confirm"].includes(location.pathname)) {
          navigate('/');
        }
      } else {
        if (!['/addnew', '/profile', '/changepassword', '/deleteaccount', '/home', '/pausedtracking'].includes(location.pathname)) {
          navigate('/home');
        }
      }
    };

    checkAuth();
  }, [location.pathname, navigate, isAuthenticated, authenticate]);

  return isAuthenticated ? (
    <Logged>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/pausedtracking" element={<PausedTracking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addnew" element={<AddNew />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/deleteaccount" element={<DeleteAccount />} />
      </Routes>
    </Logged>
  ) : (
    <Unlogged>
      <Routes>
        <Route path="/" element={<WelcomingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password-confirm" element={<ResetPasswordForm />} />
      </Routes>
    </Unlogged>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<LayoutManager />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
