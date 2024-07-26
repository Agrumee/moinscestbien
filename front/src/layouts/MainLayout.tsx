import { Outlet } from 'react-router-dom';
import Navbar from '../components/organisms/Navbar/Navbar';
import './MainLayout.scss';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <div className="content">
        <Outlet />
      </div>
      <Navbar />
    </div>
  );
};

export default MainLayout;