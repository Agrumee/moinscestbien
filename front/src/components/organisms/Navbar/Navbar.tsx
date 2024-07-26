import "./Navbar.scss";
import NavbarItem from "../../molecules/NavbarItem/NavbarItem";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="o-navbar">
      <NavbarItem iconName="home" label="Accueil" onClick={() => navigate("/")} />
      <NavbarItem iconName="add" label="Suivre" onClick={() => navigate("/addnew")} />
      <NavbarItem iconName="profile" label="Profil" onClick={() => navigate("/profile")} />
    </div>
  );
}