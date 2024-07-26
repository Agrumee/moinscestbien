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
      <Icon name={props.status} size="small"/>
      <div className="notification-content">
      <Paragraph size="medium" content={props.content} />
      </div>
    </div>
  );
}
