import Navbar from '../components/organisms/Navbar/Navbar';
import Logo from '../components/atoms/Logo/Logo'
import Icon from '../components/atoms/Icon/Icon'
import './Logged.scss';

import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Paragraph from '../components/atoms/Paragraph/Paragraph';

const Logged: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { trackedHabitCount, pausedTrackedHabitCount } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="l-logged">
      <div className='l-logged_header'>
        <Logo variant={true} size='tiny' />
        {trackedHabitCount === 0 && pausedTrackedHabitCount === 0 &&
          <div className='profile_access' onClick={() => navigate("/profile")}>
            <Icon name="profile" size='medium' color='white' />
            <Paragraph content='Accéder au profil' size='big' color='white' />
          </div>
        }
      </div>

      <div className="content">
        {children}
      </div>
      {(trackedHabitCount > 0 || pausedTrackedHabitCount > 0) &&
        <Navbar />
      }
    </div>
  );
};

export default Logged;