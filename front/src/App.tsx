import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainTemplate from './components/templates/MainTemplate';
import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import AddNew from './components/pages/AddNew';
import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainTemplate />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="addnew" element={<AddNew />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
