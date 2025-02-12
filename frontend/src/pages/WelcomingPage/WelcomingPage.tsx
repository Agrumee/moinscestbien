import Heading from "../../components/atoms/Heading/Heading";
import Button from "../../components/atoms/Button/Button";
import { useNavigateWithScroll } from "../../hooks/useNavigateWithScroll";
import "./WelcomingPage.scss";

const WelcomingPage = () => {
  const navigate = useNavigateWithScroll();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="p-welcomingpage">
      <Heading
        className="title"
        level={1}
        content="Envie de faire évoluer vos habitudes de consommation ?"
        color="white"
      />
      <Button
        variant="primary"
        content={"Se connecter"}
        onClick={handleLogin}
      />
      <Button
        variant="primary"
        content={"S'inscrire"}
        onClick={handleRegister}
      />
    </div>
  );
};
export default WelcomingPage;
