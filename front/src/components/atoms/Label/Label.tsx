import "./Label.scss";

interface LabelProps {
  content: string;
}

export default function Button({ content }: LabelProps) {
  return <label className="label">{content}</label>;
}
