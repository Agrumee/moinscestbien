import Input from "../../../components/atoms/Input/Input";
import Label from "../../../components/atoms/Label/Label";
import Heading from "../../../components/atoms/Heading/Heading";
import Button from "../../../components/atoms/Button/Button";
import Paragraph from "../../../components/atoms/Paragraph/Paragraph";
import Modal from "../../../components/molecules/Modal/Modal"
import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
//gestion erreurs
import Toast from "../../../components/molecules/Toast/Toast";
import APIError from "../../../types/apierror.models";
import "./Login.scss";
import fetchAPI from "../../../utils/fetch";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [emailToResetPassword, setEmailToResetPassword] = useState("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showErrorToast, setShowErrorToast] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleShowToast = (message: string) => {
    setShowErrorToast(false);
    setTimeout(() => {
      setError(message);
      setShowErrorToast(true);
    }, 100);
  };

  const handleSendEmailResetPassword = async (email: string) => {
    try {
      await fetchAPI("/password_reset/", {
        method: "POST", body: { email: email }
      });
      closeModal();
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

  const closeModal = () => {
    setIsModalOpen(false)
  }
  const openModal = () => {
    setIsModalOpen(true)
  }

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate("/home");
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
    <div className="p-login">
      {isModalOpen && (
        <Modal message="Entrez votre adresse e-mail afin de recevoir un mail de réinitialisation de votre mot de passe :" onConfirm={() => handleSendEmailResetPassword(emailToResetPassword)} onCancel={closeModal} input={emailToResetPassword} handleChange={(e) => setEmailToResetPassword(e.target.value)} />)}
      <Toast is_called={showErrorToast} content={error} status={"fail"} />
      <Heading className="title" level={1} content="CONNEXION" color="white" />
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
        <Button
          className="loginButton"
          variant="primary"
          content={"Se connecter"}
          onClick={handleLogin}
        />
        <div className="resetPassword" onClick={openModal}>
          <Paragraph content="Mot de passe oublié ?" color="white" />
        </div>
      </div>
      <div className="notRegistered">
        <Paragraph content="Vous n'avez pas encore de compte ?" size="medium" color="white" />
        <a href="/register">
          <Paragraph content="Créer un compte" color="white" />
        </a>
      </div>
    </div>
  );
};

export default Login;
