import Paragraph from "../components/atoms/Paragraph/Paragraph";
import Icon from "../components/atoms/Icon/Icon";
import Toast from "../components/molecules/Toast/Toast";
import Input from "../components/atoms/Input/Input";
import Dropdown from "../components/molecules/Dropdown/Dropdown";
import Accordion from "../components/organisms/Accordion/Accordion";
import ConsumptionsChart from "../components/atoms/ConsumptionsChart/ConsumptionsChart";
import CalendarButton from "../components/molecules/CalendarButton/CalendarButton";

const Home = () => {
  return (
    <>
       <Accordion productName="shopping" />
      <Accordion productName="tabac" />
    </>
  );
};

export default Home;
