import Paragraph from "../components/atoms/Paragraph/Paragraph";
import Icon from "../components/atoms/Icon/Icon";
import Toast from "../components/molecules/Toast/Toast";
import Input from "../components/atoms/Input/Input";
import Dropdown from "../components/molecules/Dropdown/Dropdown";

const Home = () => {
  return (
    <>
      <Toast
        status="loader"
        is_called={true}
        content="Chargement en cours..."
      />
      <Input className="large-input" placeholder="exemple@exemple.fr" />
      <Icon name="home" color="black" />
      <Dropdown
        label="Séléctionner"
        contentList={[
          { label: "banane", value: "banane" },
          { label: "pomme", value: "pomme" },
          { label: "pêche", value: "pêche" },
        ]}
      />
    </>
  );
};

export default Home;
