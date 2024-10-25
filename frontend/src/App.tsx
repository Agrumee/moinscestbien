import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Logged from "./layouts/Logged";
import Unlogged from "./layouts/Unlogged";
import Home from "./pages/Home";
import Profile from "./pages/Profile/Profile";
import AddNew from "./pages/AddNew";
import Login from "./pages/Auth/Login/Login";
import WelcomingPage from "./pages/WelcomingPage/WelcomingPage";
import Register from "./pages/Auth/Register/Register";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import DeleteAccount from "./pages/DeleteAccount/DeleteAccount";
import "./App.css";

const LayoutManager: React.FC = () => {
  const { csrfToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!csrfToken && !['/', '/login', '/register'].includes(location.pathname)) {
      navigate('/');
    }
    else if (csrfToken && !['/addnew', '/profile', '/changepassword', '/deleteaccount'].includes(location.pathname)) {
      navigate('/home');
    }
  }, [location.pathname, csrfToken, navigate]);

  return csrfToken ? (
    <Logged>
      <Routes>
        <Route path="/home" element={<Home />} />
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
