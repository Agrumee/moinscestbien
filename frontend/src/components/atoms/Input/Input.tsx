import "./Input.scss";

interface InputProps {
  className: "large-input" | "small-input";
  name?: string;
  placeholder?: string;
  type?: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function Input({
  className,
  placeholder,
  type,
  name,
  value,
  onChange,
}: InputProps) {
  return (
    <input
      className={className}
      placeholder={placeholder}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
    />
  );
}
