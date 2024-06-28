import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AddNew from './pages/AddNew';
import ListView from './pages/ListView';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="Profile" element={<Profile />} />
          <Route path="AddNew" element={<AddNew />} />
          <Route path="ListView" element={<ListView />} />
          {/* Ajoutez d'autres routes ici */}
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Ajoutez d'autres routes ici */}
      </Routes>
    </BrowserRouter>
  );
}