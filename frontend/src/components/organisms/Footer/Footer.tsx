
import Heading from "../../atoms/Heading/Heading";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import './Footer.scss'

import { useNavigateWithScroll } from "../../../hooks/useNavigateWithScroll";


const Footer = () => {
    const navigate = useNavigateWithScroll();

    const handleNavigate = (link: string) => {
        navigate(link)
    }

    return (
        <footer className="o-footer">
            <div className="o-footer_container">
                <div className="legal_notices" onClick={() => handleNavigate('/legalnotices')}>
                    <Heading level={3} content='Mentions légales' color='medium_green' />
                </div>
                <div className="privacy_policy" onClick={() => handleNavigate('/privacypolicy')}>
                    <Heading level={3} content='Politique de confidentialité' color='medium_green' />
                </div>
                <div className="contact_us" onClick={() => handleNavigate('/contactus')}>
                    <Heading level={3} content='Nous contacter' color='medium_green' />
                </div>
                <div className="about" onClick={() => handleNavigate('/about')}>
                    <Heading level={3} content='À propos' color='medium_green' />
                </div>
            </div>
            <div className="copyright-content">
                <Paragraph className='copyright' content="© 2024 Moins c'est bien. Tous droits réservés." size='tiny' color='dark_green' />
            </div>
        </footer >
    )
}

export default Footer