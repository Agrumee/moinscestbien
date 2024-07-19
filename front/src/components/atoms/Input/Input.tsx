import "./Input.scss";

interface InputProps {
  className: string;
  placeholder: string;
}

export default function Button({
  className,
  placeholder,
  label_content,
}: InputProps) {
  return <input className={className} placeholder={placeholder}></input>;
}
