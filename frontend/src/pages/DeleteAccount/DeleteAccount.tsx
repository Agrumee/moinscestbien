import Button from "../../components/atoms/Button/Button";
import Heading from "../../components/atoms/Heading/Heading";
import { useAuth } from "../../hooks/useAuth";
import "./DeleteAccount.scss";
import { useNavigate } from "react-router-dom";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const { deleteAccount } = useAuth();

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      navigate('/login');
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="p-delete_account">
      <Heading className="title" level={1} content="Etes-vous sûr(e) de vouloir supprimer votre compte ?" color="black" />
      <Button
        variant="primary"
        content="Confirmer"
        onClick={handleDeleteAccount}
      />
      <Button
        variant="tertiary"
        content="Annuler"
        onClick={() => navigate('/profile')}
      />
    </div>
  );
};
export default DeleteAccount;
