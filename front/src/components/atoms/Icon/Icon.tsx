import "./Icon.scss";

interface IconProps {
  name: string;
  size?: 'small' | 'medium' | 'large';
  color?: 'black' | 'white';
}

export default function Icon({ name, size = 'medium', color = 'white' }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={`a-icon ${size} ${color}`}
    >
      <use xlinkHref={`/spritemap.svg#${name}`} />
    </svg>
  );
}
