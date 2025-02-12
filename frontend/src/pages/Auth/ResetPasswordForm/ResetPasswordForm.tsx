import Label from "../../../components/atoms/Label/Label";
import Button from "../../../components/atoms/Button/Button";
import Heading from "../../../components/atoms/Heading/Heading";
import Input from "../../../components/atoms/Input/Input";

import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import { useNavigateWithScroll } from "../../../hooks/useNavigateWithScroll";
import { useToast } from "../../../hooks/useToast";

import APIError from "../../../types/apierror.models";

import "./ResetPasswordForm.scss";

export default function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const { resetPassword } = useAuth();
    const [searchParams] = useSearchParams();

    const navigate = useNavigateWithScroll();
    const { showToast } = useToast();


    const handleResetPassword = async () => {
        try {
            const token = searchParams.get('token');
            const uid = searchParams.get('uid');

            if (uid && token) {
                await resetPassword(password, confirmedPassword, uid, token);
                showToast("Votre mot de passe a été réinitialisé avec succès !", "success");
                window.scrollTo({ top: 0, behavior: "smooth" });
                setTimeout(() => navigate("/home"), 2000);
            }
        } catch (error) {
            if (error instanceof APIError) {
                showToast(error.data?.message || "Une erreur s'est produite.", "fail");
            } else {
                showToast("Une erreur inattendue est survenue.", "fail");
            }
        }
    }

    return (
        <div className="p-resetpasswordform">
            <Heading className="title" level={1} content="Modifier le mot de passe" color="white" />
            <form>
                <div className="form-item">
                    <Label content="Nouveau mot de passe" color="white" />
                    <Input
                        className="large-input"
                        placeholder="**********"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-item">
                    <Label content="Confirmer le mot de passe" color="white" />
                    <Input
                        className="large-input"
                        placeholder="**********"
                        type="password"
                        value={confirmedPassword}
                        onChange={(e) => setConfirmedPassword(e.target.value)}
                    />
                    <Button
                        variant="primary"
                        content="Confirmer"
                        onClick={handleResetPassword}
                    />
                </div>
            </form>
        </div>
    );
}