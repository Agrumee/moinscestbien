import Button from "../../components/atoms/Button/Button";
import "./Profile.scss";
import { useNavigateWithScroll } from "../../hooks/useNavigateWithScroll";
import { useAuth } from "../../hooks/useAuth";

const Profile = () => {
  const { logout, authenticate } = useAuth();
  const navigate = useNavigateWithScroll();

  const handleLogout = async () => {
    try {
      await logout();
      authenticate()
      navigate("/login");
    } catch (error) {
      throw error;
    }
  };

  const handleChangePassword = () => {
    navigate("/changepassword");
  };

  const handleDeleteAccount = () => {
    navigate("/deleteaccount");
  };

  return (
    <div className="p-profile">
      <div className="container">
        <Button
          className="changePasswordButton"
          variant="tertiary"
          size="large"
          content="Infos légales & Contact"
          onClick={() => navigate("/legalandabout")}
        />
        <Button
          className="changePasswordButton"
          variant="tertiary"
          size="large"
          content="Modifier mon mot de passe"
          onClick={handleChangePassword}
        />
        <Button
          className="logoutButton"
          variant="primary"
          size="large"
          content="Se déconnecter"
          onClick={handleLogout}
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
