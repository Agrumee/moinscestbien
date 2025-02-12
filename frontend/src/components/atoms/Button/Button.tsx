import "./Button.scss";

interface ButtonProps {
  className?: string;
  variant: "primary" | "secondary" | "tertiary";
  size?: "tiny" | "small" | "large";
  content?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  type?: 'submit' | 'reset' | 'button'
}

export default function Button({
  className = "",
  variant,
  size = "small",
  content,
  onClick,
  disabled = false,
  children,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      className={`a-button ${variant} ${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children ? children : content}
    </button>
  );
}
