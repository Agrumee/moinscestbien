import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainTemplate from './components/templates/MainTemplate';
import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import AddNew from './components/pages/AddNew';
import ListView from './components/pages/ListView';
import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainTemplate />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="addnew" element={<AddNew />} />
          <Route path="listview" element={<ListView />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}