import Paragraph from "../components/atoms/Paragraph/Paragraph";
import Icon from "../components/atoms/Icon/Icon";
import Toast from "../components/molecules/Toast/Toast";
import Input from "../components/atoms/Input/Input";
import Dropdown from "../components/molecules/Dropdown/Dropdown";
import ConsumptionsChart from "../components/atoms/ConsumptionsChart/ConsumptionsChart";

const Home = () => {

  // Exemple de données
const data = [
  { "quantity": 89.0, "date": "2024-05-28", "product": "coffee" },
  { "quantity": 67.0, "date": "2024-05-29", "product": "coffee" },
  { "quantity": 8.0, "date": "2024-05-30", "product": "coffee" },
  { "quantity": 80.0, "date": "2024-05-31", "product": "coffee" },
  { "quantity": 67.0, "date": "2024-06-01", "product": "coffee" },
  { "quantity": 59.0, "date": "2024-06-02", "product": "coffee" },
  { "quantity": 73.0, "date": "2024-06-03", "product": "coffee" },
  { "quantity": 97.0, "date": "2024-06-04", "product": "coffee" },
  { "quantity": 44.0, "date": "2024-06-05", "product": "coffee" },
  { "quantity": 53.0, "date": "2024-06-06", "product": "coffee" },
  { "quantity": 62.0, "date": "2024-06-07", "product": "coffee" },
  { "quantity": 20.0, "date": "2024-06-08", "product": "coffee" },
  { "quantity": 5.0, "date": "2024-06-09", "product": "coffee" },
  { "quantity": 80.0, "date": "2024-06-10", "product": "coffee" },
  { "quantity": 10.0, "date": "2024-06-11", "product": "coffee" },
  { "quantity": 22.0, "date": "2024-06-12", "product": "coffee" },
  { "quantity": 50.0, "date": "2024-06-13", "product": "coffee" },
  { "quantity": 67.0, "date": "2024-06-14", "product": "coffee" },
  { "quantity": 62.0, "date": "2024-06-15", "product": "coffee" },
  { "quantity": 72.0, "date": "2024-06-16", "product": "coffee" },
  { "quantity": 78.0, "date": "2024-06-17", "product": "coffee" },
  { "quantity": 86.0, "date": "2024-06-18", "product": "coffee" },
  { "quantity": 81.0, "date": "2024-06-19", "product": "coffee" },
  { "quantity": 59.0, "date": "2024-06-20", "product": "coffee" },
  { "quantity": 4.0, "date": "2024-06-22", "product": "coffee" },
  { "quantity": 34.0, "date": "2024-06-23", "product": "coffee" },
  { "quantity": 91.0, "date": "2024-06-24", "product": "coffee" },
  { "quantity": 53.0, "date": "2024-06-25", "product": "coffee" },
  { "quantity": 86.0, "date": "2024-06-26", "product": "coffee" },
  { "quantity": 34.0, "date": "2024-06-27", "product": "coffee" },
  { "quantity": 9.0, "date": "2024-06-28", "product": "coffee" },
  { "quantity": 36.0, "date": "2024-05-28", "product": "car" },
  { "quantity": 69.0, "date": "2024-05-29", "product": "car" },
  { "quantity": 60.0, "date": "2024-05-30", "product": "car" },
  { "quantity": 90.0, "date": "2024-05-31", "product": "car" },
  { "quantity": 79.0, "date": "2024-06-01", "product": "car" },
  { "quantity": 47.0, "date": "2024-06-02", "product": "car" },
  { "quantity": 97.0, "date": "2024-06-03", "product": "car" },
  { "quantity": 86.0, "date": "2024-06-04", "product": "car" },
  { "quantity": 10.0, "date": "2024-06-05", "product": "car" },
  { "quantity": 98.0, "date": "2024-06-06", "product": "car" },
  { "quantity": 84.0, "date": "2024-06-07", "product": "car" },
  { "quantity": 40.0, "date": "2024-06-08", "product": "car" },
  { "quantity": 92.0, "date": "2024-06-09", "product": "car" },
  { "quantity": 53.0, "date": "2024-06-10", "product": "car" },
  { "quantity": 88.0, "date": "2024-06-11", "product": "car" },
  { "quantity": 60.0, "date": "2024-06-12", "product": "car" },
  { "quantity": 23.0, "date": "2024-06-13", "product": "car" },
  { "quantity": 29.0, "date": "2024-06-14", "product": "car" },
  { "quantity": 53.0, "date": "2024-06-15", "product": "car" },
  { "quantity": 97.0, "date": "2024-06-16", "product": "car" },
  { "quantity": 82.0, "date": "2024-06-17", "product": "car" },
  { "quantity": 4.0, "date": "2024-06-18", "product": "car" },
  { "quantity": 81.0, "date": "2024-06-19", "product": "car" },
  { "quantity": 10.0, "date": "2024-06-20", "product": "car" },
  { "quantity": 16.0, "date": "2024-06-21", "product": "car" },
  { "quantity": 80.0, "date": "2024-06-22", "product": "car" },
  { "quantity": 69.0, "date": "2024-06-23", "product": "car" },
  { "quantity": 54.0, "date": "2024-06-24", "product": "car" },
  { "quantity": 87.0, "date": "2024-06-25", "product": "car" },
  { "quantity": 65.0, "date": "2024-06-26", "product": "car" },
  { "quantity": 79.0, "date": "2024-06-27", "product": "car" },
  { "quantity": 42.0, "date": "2024-06-28", "product": "car" },
  { "quantity": 25.0, "date": "2024-05-28", "product": "shopping" },
  { "quantity": 7.0, "date": "2024-05-29", "product": "shopping" },
  { "quantity": 89.0, "date": "2024-05-30", "product": "shopping" },
  { "quantity": 30.0, "date": "2024-05-31", "product": "shopping" },
  { "quantity": 67.0, "date": "2024-06-01", "product": "shopping" },
  { "quantity": 24.0, "date": "2024-06-02", "product": "shopping" },
  { "quantity": 85.0, "date": "2024-06-03", "product": "shopping" },
  { "quantity": 64.0, "date": "2024-06-04", "product": "shopping" },
  { "quantity": 83.0, "date": "2024-06-05", "product": "shopping" },
  { "quantity": 71.0, "date": "2024-06-06", "product": "shopping" },
  { "quantity": 49.0, "date": "2024-06-07", "product": "shopping" },
  { "quantity": 30.0, "date": "2024-06-08", "product": "shopping" },
  { "quantity": 49.0, "date": "2024-06-09", "product": "shopping" },
  { "quantity": 96.0, "date": "2024-06-10", "product": "shopping" },
  { "quantity": 91.0, "date": "2024-06-11", "product": "shopping" },
  { "quantity": 39.0, "date": "2024-06-12", "product": "shopping" },
  { "quantity": 58.0, "date": "2024-06-13", "product": "shopping" },
  { "quantity": 38.0, "date": "2024-06-14", "product": "shopping" },
  { "quantity": 25.0, "date": "2024-06-15", "product": "shopping" },
  { "quantity": 38.0, "date": "2024-06-16", "product": "shopping" },
  { "quantity": 86.0, "date": "2024-06-17", "product": "shopping" },
  { "quantity": 44.0, "date": "2024-06-18", "product": "shopping" },
  { "quantity": 84.0, "date": "2024-06-19", "product": "shopping" },
  { "quantity": 41.0, "date": "2024-06-20", "product": "shopping" },
  { "quantity": 80.0, "date": "2024-06-22", "product": "shopping" },
  { "quantity": 94.0, "date": "2024-06-23", "product": "shopping" },
  { "quantity": 33.0, "date": "2024-06-24", "product": "shopping" },
  { "quantity": 73.0, "date": "2024-06-25", "product": "shopping" },
  { "quantity": 68.0, "date": "2024-06-26", "product": "shopping" },
  { "quantity": 46.0, "date": "2024-06-27", "product": "shopping" },
  { "quantity": 7.0, "date": "2024-06-28", "product": "shopping" },
  { "quantity": 54.0, "date": "2024-06-21", "product": "shopping" },
  { "quantity": 81.0, "date": "2024-06-21", "product": "coffee" },
  { "quantity": 10.0, "date": "2024-04-21", "product": "coffee" }
];

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
    <ConsumptionsChart
      data={data}
      period="daily"
    />
    <ConsumptionsChart
      data={data}
      period="weekly"
    />
    </>
  );
};

export default Home;
