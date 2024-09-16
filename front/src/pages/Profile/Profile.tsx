import Button from "../../components/atoms/Button/Button";
import "./Profile.scss";
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from "../../hooks/useAuth";

const Profile = () => {
  const { logout, deleteAccount } = useAuth();
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      logout();
      navigate('/login');
    } catch (error) {
      throw error;
    }
  };

  const handleChangePassword = () => {
    navigate('/changepassword');  };

  const handleDeleteAccount = () => {
    try {
      deleteAccount();
      navigate('/login');
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="p-profile">
      <div className="container">
        <Button
          className="logoutButton"
          variant="primary"
          size="large"
          content="Se déconnecter"
          onClick={handleLogout}
        />
        <Button
          className="changePasswordButton"
          variant="tertiary"
          size="large"
          content="Modifier mon mot de passe"
          onClick={handleChangePassword}
        />
        <Button
          className="deleteAccountButton"
          variant="secondary"
          size="large"
          content="Supprimer mon compte"
          onClick={handleDeleteAccount}
        />
      </div>
    </div>
  );
};

export default Profile;
