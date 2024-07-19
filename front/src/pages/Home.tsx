import Paragraph from "../components/atoms/Paragraph/Paragraph";
import Heading from "../components/atoms/Heading/Heading";

const Home = () => {
  return (
    <>
      <Paragraph class="big" content="test de texte" />
      <Heading level={1} content="TEST HEADING" />
    </>
  );
};

export default Home;
