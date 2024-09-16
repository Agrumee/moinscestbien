import "./Button.scss";

interface ButtonProps {
  className?: string;
  variant: "primary" | "secondary" | "tertiary";
  size?: "small" | "large";
  content: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export default function Button({
  className = "",
  variant,
  size = "small",
  content,
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      className={`a-button ${variant} ${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
