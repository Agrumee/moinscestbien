import "./Paragraph.scss";

interface ParagraphProps {
  content: string;
  size?: 'tiny' | 'small' | 'medium' | 'big';
  color?: 'black' | 'white' | 'dark_green' | 'medium_green';
  className?: string;
}

export default function Paragraph({ content, size = 'medium', color = 'black', className }: ParagraphProps) {
  return (
    <p className={`a-paragraph ${size} ${color} ${className}`}>
      {content}
    </p>
  );
}