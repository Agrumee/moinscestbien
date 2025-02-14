import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { useNavigateWithScroll } from "./hooks/useNavigateWithScroll";
import { AuthProvider } from "./context/AuthContext"
import { ToastProvider } from "./context/ToastContext";

import Logged from "./layouts/Logged";
import Unlogged from "./layouts/Unlogged";

import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import AddNew from "./pages/AddNew/AddNew";
import DeleteAccount from "./pages/DeleteAccount/DeleteAccount";
import PausedTracking from "./pages/PausedTracking/PausedTracking";
import ResetPasswordForm from "./pages/Auth/ResetPasswordForm/ResetPasswordForm";
import PrivacyPolicy from "./pages/RGPD/PrivacyPolicy/PrivacyPolicy";
import LegalNotices from "./pages/RGPD/LegalNotices/LegalNotices";
import ContactUs from "./pages/RGPD/ContactUs/ContactUs";
import About from "./pages/RGPD/About/About";
import LegalAndAbout from "./pages/RGPD/LegalAndAbout/LegalAndAbout";

import Login from "./pages/Auth/Login/Login";
import WelcomingPage from "./pages/WelcomingPage/WelcomingPage";
import Register from "./pages/Auth/Register/Register";
import ChangePassword from "./pages/ChangePassword/ChangePassword";

import "./App.css";

const LayoutManager: React.FC = () => {
  const { authenticate, isAuthenticated } = useAuth();
  const navigate = useNavigateWithScroll();
  const location = useLocation();

  useEffect(() => {
    authenticate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      if (!['/', '/login', '/register', '/reset-password-confirm', '/legalandabout'].includes(location.pathname)) {
        navigate('/');
      }
    } else {
      if (!['/addnew', '/profile', '/changepassword', '/deleteaccount', '/home', '/pausedtracking', '/privacypolicy', '/legalnotices', '/contactus', '/about', '/legalandabout'].includes(location.pathname)) {
        navigate('/home');
      }
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return isAuthenticated ? (
    <Logged>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/pausedtracking" element={<PausedTracking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addnew" element={<AddNew />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/deleteaccount" element={<DeleteAccount />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/legalnotices" element={<LegalNotices />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/about" element={<About />} />
        <Route path="/legalandabout" element={<LegalAndAbout />} />
      </Routes>
    </Logged>
  ) : (
    <Unlogged>
      <Routes>
        <Route path="/" element={<WelcomingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password-confirm" element={<ResetPasswordForm />} />
        <Route path="/legalandabout" element={<LegalAndAbout />} />
      </Routes>
    </Unlogged>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<LayoutManager />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
