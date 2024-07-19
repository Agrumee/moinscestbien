import "./Paragraph.scss";

interface ParagraphProps {
  class: string;
  content: string;
}

export default function Paragraph(props: ParagraphProps) {
  return (
    <p className={`a-paragraph ${props.class ?? ""}`}>
      {props.content}
    </p>
  );
}