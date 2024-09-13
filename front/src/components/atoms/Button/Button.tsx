import "./Button.scss";

interface ButtonProps {
  className?: string;
  variant:  "primary" | "secondary" | "tertiary";
  size?: "small" | "large";
  content: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({ className, variant, size = "small", content, onClick }: ButtonProps) {
  return (
    <button className={`a-button ${variant} ${size} ${className}`} onClick={onClick}>
      {content}
    </button>
  );
}