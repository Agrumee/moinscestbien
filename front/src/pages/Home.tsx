import Paragraph from "../components/atoms/Paragraph/Paragraph";
import Icon from "../components/atoms/Icon/Icon";
import Toast from "../components/molecules/Toast/Toast";

const Home = () => {
  return (
    <>
      <Paragraph class="big" content="test de texte" />
      <Icon name="home" color="black" />
      <Toast status="fail" content="Echec de l'api" />
    </>
  );
};

export default Home;
