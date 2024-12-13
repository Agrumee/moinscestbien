import { useState, useEffect } from 'react';
import Paragraph from "../../atoms/Paragraph/Paragraph";
import Icon from "../../atoms/Icon/Icon";
import "./Toast.scss";

interface ToastProps {
  content: string;
  status: string;
  is_called: boolean;
}

export default function Toast({ content, status, is_called }: ToastProps) {
  const [animation, setAnimation] = useState("");

  useEffect(() => {
    if (is_called) {
      setAnimation("slide-in");
      const timeout = setTimeout(() => {
        setAnimation("slide-out");
      }, 3000);

      return () => {
        clearTimeout(timeout);
      };
    } else {
      setAnimation("");
    }
  }, [is_called]);

  return (
    <div className={`a-toast ${status} ${animation}`}>
      <Icon name={status} size="small" />
      <div className="notification-content">
        <Paragraph size="medium" content={content} />
      </div>
    </div>
  );
}

