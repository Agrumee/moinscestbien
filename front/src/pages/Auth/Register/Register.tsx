import Input from "../../../components/atoms/Input/Input";
import Label from "../../../components/atoms/Label/Label";
import Heading from "../../../components/atoms/Heading/Heading";
import Button from "../../../components/atoms/Button/Button";
import Paragraph from "../../../components/atoms/Paragraph/Paragraph";
import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";
import "./Register.scss";


const Register = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const handleRegister = async () => {
    try {
      await register(email, password, confirmedPassword);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="p-register">
      <Heading className="title" level={1} content="INSCRIPTION" color="white"/>
      <Label content="Adresse e-mail" color="white"/>
      <Input
        className="large-input"
        placeholder="exemple@exemple.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Label content="Mot de passe" color="white"/>
      <Input
        className="large-input"
        placeholder="**********"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Label content="Confirmer le mot de passe" color="white"/>
      <Input
        className="large-input"
        placeholder="**********"
        type="password"
        value={confirmedPassword}
        onChange={(e) => setConfirmedPassword(e.target.value)}
      />
      <Button
        className="registerButton"
        variant="primary"
        content="S'inscrire"
        onClick={handleRegister}
      />
      <div className="alreadyRegistered">
        <Paragraph content="Déjà inscrit ?" size="medium" color="white" />
        <a href="/login">
          <Paragraph content="Se connecter" color="white"/>
        </a>
      </div>
    </div>
  );
};

export default Register;
