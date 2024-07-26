import Paragraph from "../components/atoms/Paragraph/Paragraph";
import Icon from "../components/atoms/Icon/Icon";
import Toast from "../components/molecules/Toast/Toast";

const Home = () => {
  return (
    <>
      <Toast status="loader" is_called={true} content="Chargement en cours..." />
      <Icon name="home" color="black" />      
    </>
  );
};

export default Home;
