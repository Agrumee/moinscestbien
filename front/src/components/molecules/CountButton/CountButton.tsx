import "./CountButton.scss";
import Icon from "../../atoms/Icon/Icon";

interface CountButtonProps {
    operation: 'plus' | 'minus';
    onClick?: () => void;
}

export default function CountButton({ operation, onClick }: CountButtonProps) {
  return (
    <div className="m-count-button" onClick={onClick}>
        <Icon name={operation} color='white'/>
    </div>
  );
}