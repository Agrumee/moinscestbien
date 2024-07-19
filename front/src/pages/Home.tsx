import Paragraph from "../components/atoms/Paragraph/Paragraph";
import Heading from "../components/atoms/Heading/Heading";
import Button from "../components/atoms/Button/Button";

const Home = () => {
  const handleDeleteAccount = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Account deleted");
  };

  return (
    <>
      <Paragraph class="big" content="test de texte" />
      <Heading level={1} content="TEST HEADING 1" />
      <Heading level={2} content="TEST HEADING 2" />
      <Heading level={3} content="TEST HEADING 3" />
      <Heading level={4} content="TEST HEADING 4" />
      <Button
        className="primary"
        content="TEST PRIMARY BUTTON"
        onClick={handleDeleteAccount}
      />
      <Button
        className="secondary"
        content="TEST SECONDARY BUTTON"
        onClick={handleDeleteAccount}
      />
      <Button
        className="tertiary"
        content="TEST TERTIARY BUTTON"
        onClick={handleDeleteAccount}
      />
    </>
  );
};

export default Home;
