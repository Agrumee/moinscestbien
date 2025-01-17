import Input from "../../../components/atoms/Input/Input";
import Label from "../../../components/atoms/Label/Label";
import Heading from "../../../components/atoms/Heading/Heading";
import Button from "../../../components/atoms/Button/Button";
import Paragraph from "../../../components/atoms/Paragraph/Paragraph";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
//gestion erreurs
import Toast from "../../../components/molecules/Toast/Toast";
import APIError from "../../../types/apierror.models";
import "./Register.scss";

const Register = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const navigate = useNavigate();

  const [showErrorToast, setShowErrorToast] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const handleShowToast = (message: string) => {
    setShowErrorToast(false);
    setTimeout(() => {
      setError(message);
      setShowErrorToast(true);
    }, 100);
  };

  const handleRegister = async () => {
    try {
      await register(email, password, confirmedPassword);
      navigate('/home')
    } catch (error) {
      if (error instanceof APIError) {
        if (error.data?.message) {
          handleShowToast(error.data.message);
        } else {
          console.error("Unexpected error:", error);
          handleShowToast("An unexpected error occurred.");
        }
      } else {
        console.error("Non-API error:", error);
        handleShowToast("An unexpected error occurred.");
      }
    }

  }

  return (
    <div className="p-register">
      <Toast is_called={showErrorToast} content={error} status={"fail"} />
      <Heading className="title" level={1} content="INSCRIPTION" color="white" />
      <div className="form">
        <div className="form-item">
          <Label content="Adresse e-mail" color="white" />
          <Input
            className="large-input"
            placeholder="exemple@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-item">
          <Label content="Mot de passe" color="white" />
          <Input
            className="large-input"
            placeholder="**********"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-item">

          <Label content="Confirmer le mot de passe" color="white" />
          <Input
            className="large-input"
            placeholder="**********"
            type="password"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.target.value)}
          />
        </div>
        <Button
          className="registerButton"
          variant="primary"
          content="S'inscrire"
          onClick={handleRegister}
        />
      </div>
      <div className="alreadyRegistered">
        <Paragraph content="Déjà inscrit ?" size="medium" color="white" />
        <a href="/login">
          <Paragraph content="Se connecter" color="white" />
        </a>
      </div>
    </div>
  );
};

export default Register;
