import "./Logo.scss"
import { useNavigate } from "react-router-dom";

interface LogoProps {
    variant?: boolean;
    size?: "tiny" | "small" | "large";
}

export default function Logo({ variant, size = "large"
}: LogoProps) {
    const navigate = useNavigate();
    if (!variant) {
        return (
            <img className={`a-logo ${size}`} src={`../../../../public/moinscestbien.png`} alt='logo' onClick={() => navigate("/")} />
        )
    }

    return (
        <img className={`a-logo ${size}`} src={`../../../../public/moinscestbien-variant.png`} alt='logo' onClick={() => navigate("/")} />
    )
}