import Label from "../../components/atoms/Label/Label";
import Button from "../../components/atoms/Button/Button";
import Heading from "../../components/atoms/Heading/Heading";
import Input from "../../components/atoms/Input/Input";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./ChangePassword.scss";
import { useNavigateWithScroll } from "../../hooks/useNavigateWithScroll";

const ChangePassword = () => {
  const navigate = useNavigateWithScroll();
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const { changePassword } = useAuth();

  const handleChangePassword = async () => {
    try {
      await changePassword(password, confirmedPassword);
      navigate('/profile');
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="p-change_password">
      <Heading className="title" level={1} content="Modifier le mot de passe" color="black" />
      <div className="p-change_password_form">
        <div className="input_with_label">
          <Label content="Nouveau mot de passe" color="black" />
          <Input
            className="large-input"
            placeholder="**********"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="input_with_label">
          <Label content="Confirmer le mot de passe" color="black" />
          <Input
            className="large-input"
            placeholder="**********"
            type="password"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
          />
        </div>
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
    </div>
  );
};
export default ChangePassword;
