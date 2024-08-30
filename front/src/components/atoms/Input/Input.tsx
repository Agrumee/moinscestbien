import "./Input.scss";

interface InputProps {
  className: "large-input" | "small-input";
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  className,
  placeholder,
  type = "text",
  value,
  onChange,
}: InputProps) {
  return (
    <input
      className={className}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
    />
  );
}
