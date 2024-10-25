import "./Icon.scss";

interface IconProps {
  name: string;
  size?: "tiny" | "small" | "medium" | "large";
  color?: "black" | "white" | "red";
  animation?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Icon({
  name,
  size = "medium",
  color = "white",
  animation = "",
  onClick,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={`a-icon ${size} ${color} ${animation}`}
      onClick={onClick}
    >
      <use xlinkHref={`/spritemap.svg#${name}`} />
    </svg>
  );
}
