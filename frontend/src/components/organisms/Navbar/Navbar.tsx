import "./Navbar.scss";
import NavbarItem from "../../molecules/NavbarItem/NavbarItem";
import Logo from "../../atoms/Logo/Logo";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const { trackedHabitCount, pausedTrackedHabitCount } = useAuth();

  return (
    <div className="o-navbar">
      <Logo size="tiny" />
      {trackedHabitCount > 0 &&
        <NavbarItem iconName="home" label="Accueil" onClick={() => navigate("/")} />
      }
      <NavbarItem iconName="add" label="Suivre" onClick={() => navigate("/addnew")} />
      {
        pausedTrackedHabitCount > 0 &&
        <NavbarItem iconName="pause" label="En pause" onClick={() => navigate("/pausedtracking")} />

      }
      <NavbarItem iconName="profile" label="Profil" onClick={() => navigate("/profile")} />
    </div>
  );
}