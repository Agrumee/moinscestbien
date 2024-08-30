import Input from "../../components/atoms/Input/Input";
import Label from "../../components/atoms/Label/Label";
import Heading from "../../components/atoms/Heading/Heading";
import Button from "../../components/atoms/Button/Button";
import Paragraph from "../../components/atoms/Paragraph/Paragraph";

import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const csrfResponse = await fetch("http://127.0.0.1:8000/api/csrf_cookie/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!csrfResponse.ok) {
        throw new Error("Failed to fetch CSRF token");
      }

      const loginResponse = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await loginResponse.json();

      if (loginResponse.ok) {
        console.log("User authenticated:", data.username);
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  function getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  }
  

  return (
    <>
      <Heading level={1} content="CONNEXION" />
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
      <Button 
        className="primary" 
        content="Se connecter" 
        onClick={handleLogin} 
      />
      <Paragraph
        content="Vous n'avez pas de compte ?"
        size="medium"
        color="black"
      />
      <a href="/register">
        <Paragraph content="S'inscrire" />
      </a>
    </>
  );
};

export default Login;
