import "./Navbar.scss";
import NavbarItem from "../molecules/NavbarItem";

export default function Navbar() {
  return (
    <div className="o-navbar">
      <NavbarItem iconName="home" label="Accueil" />
      <NavbarItem iconName="add" label="Suivre" />
      <NavbarItem iconName="profile" label="Profil" />
    </div>
  );
}