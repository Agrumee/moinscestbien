import Label from "../../components/atoms/Label/Label";
import Button from "../../components/atoms/Button/Button";
import Heading from "../../components/atoms/Heading/Heading";
import Input from "../../components/atoms/Input/Input";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./ChangePassword.scss";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const { changePassword } = useAuth();

  const handleChangePassword = async () => {
    try {
      changePassword(password, confirmedPassword);
      navigate('/profile');
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="p-change_password">
      <Heading className="title" level={1} content="Modifier le mot de passe" color="black" />
      <Label content="Nouveau mot de passe" color="black" />
      <Input
        className="large-input"
        placeholder="**********"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Label content="Confirmer le mot de passe" color="black" />
      <Input
        className="large-input"
        placeholder="**********"
        type="password"
        value={confirmedPassword}
        onChange={(e) => setConfirmedPassword(e.target.value)}
      />
      <Button
        className="changePasswordButton"
        variant="primary"
        content="Confirmer"
        onClick={handleChangePassword}
      />
      <Button
        className="cancelButton"
        variant="tertiary"
        content="Annuler"
        onClick={() => navigate('/profile')}
      />
    </div>
  );
};
export default ChangePassword;
