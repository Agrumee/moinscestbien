import { createContext, useState, ReactNode } from "react";
import Toast from "../components/molecules/Toast/Toast";

type ToastContextType = {
    showToast: (message: string, status: "success" | "fail") => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"success" | "fail">("fail");

    const showToast = (msg: string, type: "success" | "fail") => {
        setMessage(msg);
        setStatus(type);
        setIsVisible(true);
        setTimeout(() => setIsVisible(false), 4000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {isVisible && <Toast is_called={true} content={message} status={status} />}
        </ToastContext.Provider>
    );
};
