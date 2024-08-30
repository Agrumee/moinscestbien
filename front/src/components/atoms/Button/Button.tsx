import "./Button.scss";

interface ButtonProps {
  className: "primary" | "secondary" | "tertiary";
  content: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({ className, content, onClick }: ButtonProps) {
  return (
    <button className={className} onClick={onClick}>
      {content}
    </button>
  );
}