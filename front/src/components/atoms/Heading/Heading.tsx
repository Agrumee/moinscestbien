import "./Heading.scss";

interface HeadingProps {
  level: 1 | 2 | 3 | 4;
  content: string;
}

export default function Heading(props: HeadingProps) {
  switch (props.level) {
    case 1:
      return <h1>{props.content}</h1>;
    case 2:
      return <h2>{props.content}</h2>;
    case 3:
      return <h3>{props.content}</h3>;
    case 4:
      return <h4>{props.content}</h4>;
    default:
      return <h1>{props.content}</h1>;
  }
};