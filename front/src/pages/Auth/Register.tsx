import Input from "../../components/atoms/Input/Input";
import Label from "../../components/atoms/Label/Label";
import Heading from "../../components/atoms/Heading/Heading";
import Button from "../../components/atoms/Button/Button";
import Paragraph from "../../components/atoms/Paragraph/Paragraph";

import { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const handleRegister = () => {
    console.log("inscrit !")
  }

  function getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return undefined;
  }

  return (
    <>
      <Heading level={1} content="INSCRIPTION" />
      <Label content="Adresse e-mail" />
      <Input
        className="large-input"
        placeholder="exemple@exemple.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Label content="Mot de passe" />
      <Input
        className="large-input"
        placeholder="**********"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Label content="Confirmer le mot de passe" />
      <Input
        className="large-input"
        placeholder="**********"
        type="password"
        value={confirmedPassword}
        onChange={(e) => setConfirmedPassword(e.target.value)}
      />
      <Button
        className="primary"
        content="S'inscrire"
        onClick={handleRegister}
      />
      <div>
        <Paragraph
          content="Déjà inscrit ?"
          size="medium"
          color="black"
        />
        <a href="/login">
          <Paragraph content="Se connecter" />
        </a>
      </div>
    </>
  );
};

export default Register;
