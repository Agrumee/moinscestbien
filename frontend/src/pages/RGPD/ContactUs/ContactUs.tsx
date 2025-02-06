import Heading from "../../../components/atoms/Heading/Heading";
import Paragraph from "../../../components/atoms/Paragraph/Paragraph";
import Input from "../../../components/atoms/Input/Input";
import Label from "../../../components/atoms/Label/Label";
import Button from "../../../components/atoms/Button/Button";

import fetchAPI from "../../../utils/fetch";
import APIError from "../../../types/apierror.models";

import "./ContactUs.scss";

import { useState } from "react";
import { useToast } from "../../../hooks/useToast";
import { useNavigateWithScroll } from "../../../hooks/useNavigateWithScroll";

function ContactUs() {
    const MAX_LENGTH = 512;
    const [remainingChars, setRemainingChars] = useState(MAX_LENGTH);
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const { showToast } = useToast();
    const navigate = useNavigateWithScroll();;


    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = event.target.value;
        setMessage(text);
        setRemainingChars(MAX_LENGTH - text.length);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const sendContact = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetchAPI("/accounts/contactus", {
                method: "POST",
                body: { message, name, email },
            });

            setName("");
            setEmail("");
            setMessage("");
            setRemainingChars(MAX_LENGTH);

            showToast(response.message || "Votre message a bien été envoyé !", "success");
            window.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => navigate("/home"), 2000);

        } catch (error) {
            if (error instanceof APIError) {
                showToast(error.data?.message || "Une erreur s'est produite.", "fail");
            } else {
                showToast("Une erreur inattendue est survenue.", "fail");
            }
        }
    };

    return (
        <div className="p-contactus">
            {/* <Toast is_called={showToast} content={toastMessage} status={toastStatus} /> */}
            <Heading level={1} content="Nous contacter" />
            <Paragraph content="Vous pouvez nous contacter afin de :" />

            <ul>
                <li>Nous faire part de vos suggestions</li>
                <li>Nous signaler un dysfonctionnement</li>
                <li>Exercer vos droits (accès, rectification, suppression des données)</li>
                <li>En savoir plus sur l'Application</li>
                <li>Autre</li>
            </ul>

            <form onSubmit={sendContact}>
                <Label content="Nom :" />
                <Input
                    className="large-input"
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleNameChange}
                    required
                />

                <Label content="Email :" />
                <Input
                    className="large-input"
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                />

                <Label content="Message :" />
                <Paragraph content={`${remainingChars} caractères restants`} />

                <textarea
                    name="message"
                    rows={10}
                    maxLength={MAX_LENGTH}
                    required
                    value={message}
                    onChange={handleTextChange}
                />


                <Button variant="primary" content="Envoyer" type="submit" />
            </form>
        </div>
    );
}

export default ContactUs;

