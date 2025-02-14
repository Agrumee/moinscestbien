import Input from "../../../components/atoms/Input/Input";
import Label from "../../../components/atoms/Label/Label";
import Heading from "../../../components/atoms/Heading/Heading";
import Button from "../../../components/atoms/Button/Button";
import Paragraph from "../../../components/atoms/Paragraph/Paragraph";
import Modal from "../../../components/molecules/Modal/Modal"

import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";
import { useNavigateWithScroll } from "../../../hooks/useNavigateWithScroll";
import { useToast } from "../../../hooks/useToast";

import APIError from "../../../types/apierror.models";
import fetchAPI from "../../../utils/fetch";
import "./Login.scss";

const Login = () => {
  const { login, authenticate } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigateWithScroll();
  const [emailToResetPassword, setEmailToResetPassword] = useState("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { showToast } = useToast();

  const handleSendEmailResetPassword = async (email: string) => {
    try {
      const response = await fetchAPI("/accounts/password-reset", {
        method: "POST", body: { email: email }
      });
      closeModal();
      showToast(response.message || "Si une adresse mail correspond à une adresse valide, un lien de réinitialisation de votre mot de passe vous a été envoyé !", "success");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => navigate("/home"), 2000);
    } catch (error) {
      if (error instanceof APIError) {
        showToast(error.data?.message || "Une erreur s'est produite.", "fail");
      } else {
        showToast("Une erreur inattendue est survenue.", "fail");
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
      authenticate()
      navigate("/home");
      showToast("Connexion réussie !", "success")
    } catch (error) {
      if (error instanceof APIError) {
        if (error.data?.message) {
          showToast(error.data.message, "fail");
        } else {
          console.error("Unexpected error:", error);
          showToast("Une erreur est survenue.", "fail");
        }
      } else {
        console.error("Non-API error:", error);
        showToast("Une erreur inattendue est survenue.", "fail");
      }
    }
  }

  return (
    <div className="p-login">
      {isModalOpen && (
        <Modal message="Entrez votre adresse e-mail afin de recevoir un mail de réinitialisation de votre mot de passe :" onConfirm={() => handleSendEmailResetPassword(emailToResetPassword)} onCancel={closeModal} input={emailToResetPassword} handleChange={(e) => setEmailToResetPassword(e.target.value)} />)}
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
        <a href="/legalandabout">
          <Paragraph className="href-link legalandabout" content="Consulter la politique de confidentialité" color="white" />
        </a>
        <Button
          className="loginButton"
          variant="primary"
          content={"Se connecter"}
          onClick={handleLogin}
        />
        <div className="resetPassword" onClick={openModal}>
          <Paragraph className="href-link" content="Mot de passe oublié ?" color="white" />
        </div>
      </div>
      <div className="notRegistered">
        <Paragraph content="Vous n'avez pas encore de compte ?" size="medium" color="white" />
        <a href="/register">
          <Paragraph className="href-link" content="Créer un compte" color="white" />
        </a>
      </div>
    </div>
  );
};

export default Login;
