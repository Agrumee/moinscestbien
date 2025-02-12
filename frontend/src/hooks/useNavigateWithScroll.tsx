import { useNavigate } from "react-router-dom";

export const useNavigateWithScroll = () => {
    const navigate = useNavigate();

    return (to: string, options?: any) => {
        navigate(to, options);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
};
