import "./Paragraph.scss";

interface ParagraphProps {
  content: string;
  size?: 'tiny' | 'small' | 'medium' | 'big';
  color?: 'black' | 'white';
}

export default function Paragraph( { content, size='small', color='black' } : ParagraphProps) {
  return (
    <p className={`a-paragraph ${size} ${color}`}>
      {content}
    </p>
  );
}