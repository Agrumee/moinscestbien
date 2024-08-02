import "./Input.scss";

interface InputProps {
  className: string;
  placeholder: string;
}

export default function Input({
  className,
  placeholder,
}: InputProps) {
  return <input className={className} placeholder={placeholder}></input>;
}
