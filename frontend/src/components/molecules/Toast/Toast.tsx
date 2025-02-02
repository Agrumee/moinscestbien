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
        setTimeout(() => setAnimation(""), 500);
      }, 3000);

      return () => {
        clearTimeout(timeout);
      };
    } else {
      setAnimation("");
    }
  }, [content, is_called]);

  useEffect(() => {
    if (content) {
      setAnimation("slide-in");
    }
  }, [content]);


  return (
    <div className={`a-toast ${status} ${animation}`}>
      <Icon name={status} size="small" />
      <div className="notification-content">
        <Paragraph size="medium" content={content} />
      </div>
    </div>
  );
}

