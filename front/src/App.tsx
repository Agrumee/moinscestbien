import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainTemplate from './components/templates/MainTemplate';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AddNew from './pages/AddNew';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

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
