import Input from "../../../components/atoms/Input/Input";
import Label from "../../../components/atoms/Label/Label";
import Heading from "../../../components/atoms/Heading/Heading";
import Button from "../../../components/atoms/Button/Button";
import Paragraph from "../../../components/atoms/Paragraph/Paragraph";

import { useAuth } from "../../../hooks/useAuth";
import { useNavigateWithScroll } from "../../../hooks/useNavigateWithScroll";
import { useState } from "react";
import { useToast } from "../../../hooks/useToast";

import APIError from "../../../types/apierror.models";
import "./Register.scss";

const Register = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const navigate = useNavigateWithScroll();
  const { showToast } = useToast();

  const handleRegister = async () => {
    try {
      await register(email, password, confirmedPassword);
      showToast("Inscription réussie !", "success");
      window.scrollTo({ top: 0, behavior: "smooth" });
      navigate("/login")
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
    <div className="p-register">
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
