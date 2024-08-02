import Paragraph from "../components/atoms/Paragraph/Paragraph";
import Icon from "../components/atoms/Icon/Icon";
import Toast from "../components/molecules/Toast/Toast";
import Input from "../components/atoms/Input/Input";
import Dropdown from "../components/molecules/Dropdown/Dropdown";
import ConsumptionsChart from "../components/atoms/ConsumptionsChart/ConsumptionsChart";

const Home = () => {

// Exemple de données => appel api à faire
const dataByDay = [
  { "quantity": 15.0, "date": "2024-06-01", "product": "coffee" },
  { "quantity": 12.0, "date": "2024-06-01", "product": "car" },
  { "quantity": 9.0, "date": "2024-06-01", "product": "shopping" },

  { "quantity": 8.0, "date": "2024-06-02", "product": "coffee" },
  { "quantity": 11.0, "date": "2024-06-02", "product": "shopping" },

  { "quantity": 15.0, "date": "2024-06-03", "product": "car" },
  { "quantity": 16.0, "date": "2024-06-03", "product": "shopping" },

  { "quantity": 10.0, "date": "2024-06-04", "product": "coffee" },
  { "quantity": 17.0, "date": "2024-06-04", "product": "car" },
  { "quantity": 12.0, "date": "2024-06-04", "product": "shopping" },

  { "quantity": 9.0, "date": "2024-06-05", "product": "coffee" },
  { "quantity": 8.0, "date": "2024-06-05", "product": "car" },

  { "quantity": 11.0, "date": "2024-06-06", "product": "coffee" },
  { "quantity": 13.0, "date": "2024-06-06", "product": "car" },
  { "quantity": 15.0, "date": "2024-06-06", "product": "shopping" },

  { "quantity": 12.0, "date": "2024-06-07", "product": "coffee" },
  { "quantity": 10.0, "date": "2024-06-07", "product": "car" },
  { "quantity": 17.0, "date": "2024-06-07", "product": "shopping" }
];

const dataByMonth = [
  // Coffee data
  { "quantity": 15.0, "date": "2024-01-05", "product": "coffee" },
  { "quantity": 12.0, "date": "2024-01-18", "product": "coffee" },
  { "quantity": 17.0, "date": "2024-02-12", "product": "coffee" },
  { "quantity": 8.0, "date": "2024-02-26", "product": "coffee" },
  { "quantity": 13.0, "date": "2024-03-10", "product": "coffee" },
  { "quantity": 16.0, "date": "2024-03-22", "product": "coffee" },
  { "quantity": 9.0, "date": "2024-04-08", "product": "coffee" },
  { "quantity": 14.0, "date": "2024-04-21", "product": "coffee" },
  { "quantity": 11.0, "date": "2024-05-02", "product": "coffee" },
  { "quantity": 19.0, "date": "2024-05-15", "product": "coffee" },
  { "quantity": 7.0, "date": "2024-06-04", "product": "coffee" },
  { "quantity": 18.0, "date": "2024-06-20", "product": "coffee" },

  // Car data
  { "quantity": 20.0, "date": "2024-01-10", "product": "car" },
  { "quantity": 8.0, "date": "2024-01-25", "product": "car" },
  { "quantity": 15.0, "date": "2024-02-08", "product": "car" },
  { "quantity": 11.0, "date": "2024-02-22", "product": "car" },
  { "quantity": 14.0, "date": "2024-03-14", "product": "car" },
  { "quantity": 12.0, "date": "2024-03-28", "product": "car" },
  { "quantity": 17.0, "date": "2024-04-11", "product": "car" },
  { "quantity": 19.0, "date": "2024-04-25", "product": "car" },
  { "quantity": 10.0, "date": "2024-05-05", "product": "car" },
  { "quantity": 16.0, "date": "2024-05-19", "product": "car" },
  { "quantity": 9.0, "date": "2024-06-04", "product": "car" },
  { "quantity": 13.0, "date": "2024-06-18", "product": "car" },

  // Shopping data
  { "quantity": 18.0, "date": "2024-01-08", "product": "shopping" },
  { "quantity": 12.0, "date": "2024-01-22", "product": "shopping" },
  { "quantity": 14.0, "date": "2024-02-10", "product": "shopping" },
  { "quantity": 8.0, "date": "2024-02-28", "product": "shopping" },
  { "quantity": 16.0, "date": "2024-03-12", "product": "shopping" },
  { "quantity": 20.0, "date": "2024-03-26", "product": "shopping" },
  { "quantity": 13.0, "date": "2024-04-05", "product": "shopping" },
  { "quantity": 17.0, "date": "2024-04-20", "product": "shopping" },
  { "quantity": 15.0, "date": "2024-05-08", "product": "shopping" },
  { "quantity": 11.0, "date": "2024-05-22", "product": "shopping" },
  { "quantity": 14.0, "date": "2024-06-10", "product": "shopping" },
  { "quantity": 9.0, "date": "2024-06-25", "product": "shopping" }
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
      data={dataByDay}
      period="daily"
    />
    <ConsumptionsChart
      data={dataByMonth}
      period="monthly"
    />
    <ConsumptionsChart
      data={dataByDay}
      period="weekly"
    />
    </>
  );
};

export default Home;
