import Input from "../../../components/atoms/Input/Input";
import Label from "../../../components/atoms/Label/Label";
import Heading from "../../../components/atoms/Heading/Heading";
import Button from "../../../components/atoms/Button/Button";
import Paragraph from "../../../components/atoms/Paragraph/Paragraph";
import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate("/home");
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="p-login">
      <Heading className="title" level={1} content="CONNEXION" color="white"/>
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
      <Button
      className="loginButton"
        variant="primary"
        content={"Se connecter"}
        onClick={handleLogin}
      />
      <div className="notRegistered">
        <Paragraph content="Vous n'avez pas encore de compte ?" size="medium" color="white" />
        <a href="/register">
          <Paragraph content="Créer un compte" color="white"/>
        </a>
      </div>
    </div>
  );
};

export default Login;
