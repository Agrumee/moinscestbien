import Heading from '../../../components/atoms/Heading/Heading'
import Paragraph from '../../../components/atoms/Paragraph/Paragraph'
import { useNavigateWithScroll } from "../../../hooks/useNavigateWithScroll";


import './LegalNotices.scss'

const LegalNotices = () => {
    const navigate = useNavigateWithScroll();

    return (
        <div className='p-legalnotices'>
            <Heading content='Mentions Légales' level={1} />

            <Heading content="1. Éditeur de l'application" level={2} />

            <Paragraph content="L'application 'Moins c'est bien' est un projet étudiant développé à des fins pédagogiques et non commerciales." />
            <Paragraph content='Responsable du projet : Grimault Mehdi, Rivière Clémentine' />
            <div className='contactus_link'>
                <Paragraph content="Pour nous contacter : " />
                <div className="href-link" onClick={() => navigate("/contactus")}>  Cliquez-ici </div>
            </div>

            <Heading content="2. Hébergement" level={2} />

            <Paragraph content="L'application est hébergée par :Nom de l'hébergeur : OVHCloud Roubaix, France." />

            <Heading content="3. Propriété intellectuelle" level={2} />

            <Paragraph content="Tous les contenus présents sur l'application, y compris les textes, images, logos et graphismes, sont la propriété de leurs auteurs respectifs." />
            <Paragraph content="Toute reproduction ou utilisation sans autorisation est interdite." />

            <Heading content="4. Protection des données personnelles" level={2} />

            <Paragraph content="L'application collecte des données personnelles uniquement pour son bon fonctionnement et ne les partage pas avec des tiers. " />
            <div className='contactus_link'>
                <Paragraph content="Pour plus de détails, veuillez consulter notre " />
                <div className="href-link" onClick={() => navigate("/privacypolicy")}> Politique de confidentialité</div>
            </div>

            <Heading content="5. Responsabilité" level={2} />

            <Paragraph content="L'application 'Moins c'est bien' est un outil destiné à accompagner les utilisateurs dans l'évolution de leurs habitudes de consommation. Cependant, les informations fournies sont indicatives et ne constituent pas un avis professionnel. L'équipe du projet ne saurait être tenue responsable de l'utilisation des données par les utilisateurs." />

            <Heading content="6. Contact" level={2} />

            <div className='contactus_link'>
                <Paragraph content="Pour toute question ou demande d'information, vous pouvez nous contacter : " />
                <div className="href-link" onClick={() => navigate("/contactus")}>  via ce formulaire </div>
            </div>



        </div>
    )
}

export default LegalNotices