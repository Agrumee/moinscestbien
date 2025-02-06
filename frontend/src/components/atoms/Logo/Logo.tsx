import "./Logo.scss"
import { useNavigateWithScroll } from "../../../hooks/useNavigateWithScroll";

interface LogoProps {
    variant?: boolean;
    size?: "tiny" | "small" | "large";
}

export default function Logo({ variant, size = "large"
}: LogoProps) {
    const navigate = useNavigateWithScroll();
    if (!variant) {
        return (
            <img className={`a-logo ${size}`} src={`../../../../public/moinscestbien.png`} alt='logo' onClick={() => navigate("/")} />
        )
    }

    return (
        <img className={`a-logo ${size}`} src={`../../../../public/moinscestbien-variant.png`} alt='logo' onClick={() => navigate("/")} />
    )
}