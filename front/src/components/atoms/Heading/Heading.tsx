import "./Heading.scss";

interface HeadingProps {
  className?: string;
  level: 1 | 2 | 3 | 4;
  content: string;
  color?: 'black' | 'white';
}

export default function Heading(props: HeadingProps) {
  switch (props.level) {
    case 1:
      return <h1 className={`${props.className} ${props.color}`}>{props.content}</h1>;
    case 2:
      return <h2 className={`${props.className} ${props.color}`}>{props.content}</h2>;
    case 3:
      return <h3 className={`${props.className} ${props.color}`}>{props.content}</h3>;
    case 4:
      return <h4 className={`${props.className} ${props.color}`}>{props.content}</h4>;
    default:
      return <h1 className={`${props.className} ${props.color}`}>{props.content}</h1>;
  }
};