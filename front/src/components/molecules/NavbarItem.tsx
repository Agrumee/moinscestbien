import "./NavbarItem.scss";
import Icon from "../atoms/Icon/Icon";
import Paragraph from "../atoms/Paragraph/Paragraph";


interface NavbarItemProps {
    iconName: string;
    label: string;
}

export default function NavbarItem({ iconName, label }: NavbarItemProps) {
  return (
    <div className="m-navbar-item">
      <Icon name={iconName} />
      <Paragraph content={label} size="small" color="white"/>
    </div>
  );
}
