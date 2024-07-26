import "./NavbarItem.scss";
import Icon from "../atoms/Icon/Icon";
import Paragraph from "../atoms/Paragraph/Paragraph";


interface NavbarItemProps {
    iconName: string;
    label: string;
    onClick?: () => void;
}

export default function NavbarItem({ iconName, label, onClick }: NavbarItemProps) {
  return (
    <div className="m-navbar-item" onClick={onClick}>
      <Icon name={iconName} />
      <Paragraph content={label} size="small" color="white"/>
    </div>
  );
}
