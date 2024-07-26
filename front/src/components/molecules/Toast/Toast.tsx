import Paragraph from "../../atoms/Paragraph/Paragraph";
import Icon from "../../atoms/Icon/Icon";
import "./Toast.scss";

interface ToastProps {
  content: string;
  status: string;
}

export default function Toast(props: ToastProps) {
  return (
    <div className={`a-toast ${props.status}`}>
      <Icon name={props.status} />
      <Paragraph class="medium" content={props.content} />
    </div>
  );
}
