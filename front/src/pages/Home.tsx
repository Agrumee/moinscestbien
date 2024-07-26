import Toast from "../components/molecules/Toast/Toast";

const Home = () => {
  return (
    <>
      <h1>Accueil</h1>;
      <Toast status="fail" content="Echec de l'api" />
    </>
  );
};

export default Home;
