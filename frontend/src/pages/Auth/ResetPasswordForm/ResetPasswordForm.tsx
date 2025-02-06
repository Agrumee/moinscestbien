import Label from "../../../components/atoms/Label/Label";
import Button from "../../../components/atoms/Button/Button";
import Heading from "../../../components/atoms/Heading/Heading";
import Input from "../../../components/atoms/Input/Input";
import Toast from '../../../components/molecules/Toast/Toast'
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import "./ResetPasswordForm.scss";
import { useSearchParams } from "react-router-dom";
import { useNavigateWithScroll } from "../../../hooks/useNavigateWithScroll";
import APIError from "../../../types/apierror.models";

export default function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const { resetPassword } = useAuth();
    const [searchParams] = useSearchParams();
    const [showErrorToast, setShowErrorToast] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const navigate = useNavigateWithScroll();


    const handleShowToast = (message: string) => {
        setShowErrorToast(false);
        setTimeout(() => {
            setError(message);
            setShowErrorToast(true);
            window.scrollTo({ top: 0, behavior: "smooth" });

        }, 100);
    };

    const handleResetPassword = async () => {
        try {
            const token = searchParams.get('token');
            const uid = searchParams.get('uid');

            if (uid && token) {
                await resetPassword(password, confirmedPassword, uid, token);
            }
        } catch (error) {
            if (error instanceof APIError) {
                if (error.data?.message) {
                    handleShowToast(error.data.message);
                } else {
                    console.error("Unexpected error:", error);
                    handleShowToast("An unexpected error occurred.");
                }
            } else {
                console.error("Non-API error:", error);
                handleShowToast("An unexpected error occurred.");
            }
            return
        }
        navigate("/")
    };
    return (
        <div className="p-change_password">
            <Toast is_called={showErrorToast} content={error} status={"fail"} />

            <Heading className="title" level={1} content="Modifier le mot de passe" color="black" />
            <Label content="Nouveau mot de passe" color="black" />
            <Input
                className="large-input"
                placeholder="**********"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Label content="Confirmer le mot de passe" color="black" />
            <Input
                className="large-input"
                placeholder="**********"
                type="password"
                value={confirmedPassword}
                onChange={(e) => setConfirmedPassword(e.target.value)}
            />
            <Button
                className="changePasswordButton"
                variant="primary"
                content="Confirmer"
                onClick={handleResetPassword}
            />
        </div>
    );
}