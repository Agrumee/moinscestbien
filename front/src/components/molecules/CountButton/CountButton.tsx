import "./CountButton.scss";
import Icon from "../../atoms/Icon/Icon";

interface CountButtonProps {
  operation: 'plus' | 'minus';
  onClick?: (value: number) => void;
}

const CountButton: React.FC<CountButtonProps> = ({ operation, onClick }) => {
  const handleClick = () => {
      const value = operation === 'plus' ? 1 : -1;
      if (onClick) {
          onClick(value);
      }
  };

  return (
      <div className="m-count-button" onClick={handleClick}>
          <Icon name={operation} color="white" />
      </div>
  );
};

export default CountButton;