import Paragraph from '../components/atoms/Paragraph/Paragraph';
import Icon from '../components/atoms/Icon/Icon';
import NavbarItem from '../components/molecules/NavbarItem';
import Navbar from '../components/organisms/Navbar';

const Home = () => {
  return (
    <>
      <Icon name="home" color="black"/>
      <NavbarItem iconName="home" label="Home" />
      <Navbar/>
    </>
  );
};

export default Home;
