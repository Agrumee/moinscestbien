import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth'; 
import Logged from './layouts/Logged';
import Unlogged from './layouts/Unlogged';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AddNew from './pages/AddNew';
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register';

const LayoutManager: React.FC = () => {
  const { user } = useAuth(); // Utilisation du hook useAuth

  // Si l'utilisateur est connecté, on affiche le layout Logged, sinon Unlogged
  return user ? (
    <Logged>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="addnew" element={<AddNew />} />
      </Routes>
    </Logged>
  ) : (
    <Unlogged>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Unlogged>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<LayoutManager />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
