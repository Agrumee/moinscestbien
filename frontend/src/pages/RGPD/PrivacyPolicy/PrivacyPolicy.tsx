import Heading from '../../../components/atoms/Heading/Heading'
import Paragraph from '../../../components/atoms/Paragraph/Paragraph'
import { useNavigateWithScroll } from "../../../hooks/useNavigateWithScroll";

import './PrivacyPolicy.scss'

const PrivacyPolicy = () => {
    const navigate = useNavigateWithScroll();

    return (
        <div className='p-privacypolicy'>
            <Heading content="Politique de confidentialité" level={1} />

            <Paragraph content="Date d’entrée en vigueur : 05/02/2024" />

            <Heading content="1. Introduction" level={2} />
            <Paragraph content="Bienvenue sur Moins c'est bien, un projet étudiant développé dans le but d’accompagner les utilisateurs dans l'évolution de leurs habitudes de consommation. La protection de vos données personnelles est une priorité." />
            <Paragraph content="Cette politique vise à vous informer sur la manière dont nous collectons, utilisons et protégeons vos données." />

            <Heading content="2. Données collectées" level={2} />
            <Paragraph content="L'Application collecte uniquement les données nécessaires à son bon fonctionnement, à savoir :" />
            <ul>
                <Paragraph content="- Données renseignées volontairement par l'utilisateur (ex : informations de consommation, préférences)." />
                <Paragraph content="- Données techniques (adresse IP, type d'appareil, navigateur utilisé)." />
                <Paragraph content="- Cookies strictement nécessaires à l'utilisation de l'Application." />
            </ul>

            <Paragraph content="Aucune donnée sensible n'est collectée ni utilisée à des fins commerciales." />

            <Heading content="3. Finalité de la collecte des données" level={2} />
            <Paragraph content="Les données collectées servent uniquement à :" />

            <ul>
                <Paragraph content="- Améliorer l'expérience utilisateur." />
                <Paragraph content="- Permettre le suivi et l'affichage des habitudes de consommation." />
                <Paragraph content="- Garantir le bon fonctionnement de l'Application." />
            </ul>

            <Paragraph content="Aucune donnée n'est partagée avec des tiers." />

            <Heading content="4. Cookies" level={2} />
            <Paragraph content="L'Application utilise uniquement des cookies nécessaires à son bon fonctionnement. Aucune publicité ni suivi marketing n'est réalisé. En utilisant l'Application, vous acceptez l'utilisation de ces cookies." />

            <Heading content="5. Conservation des données" level={2} />
            <Paragraph content="Les données collectées sont conservées uniquement pendant la durée d'utilisation de l'Application par l'utilisateur et sont supprimées sur simple demande." />

            <Heading content="6. Droits des utilisateurs" level={2} />
            <Paragraph content="Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :" />
            <ul>
                <Paragraph content="- Droit d'accès, de rectification et de suppression de vos données." />
                <Paragraph content="- Droit d'opposition et de limitation du traitement.
                - Droit à la portabilité de vos données." />
            </ul>
            <div className='contactus_link'>
                <Paragraph content="Pour exercer vos droits, vous pouvez nous contacter " />
                <div onClick={() => navigate("/contactus")}>  en ciquant ici </div>
            </div>
            <Heading content="7. Sécurité des données" level={2} />
            <Paragraph content="Nous mettons en place des mesures de sécurité pour protéger vos données contre tout accès non autorisé, altération ou destruction." />

            <Heading content="8. Modification de la politique de confidentialité" level={2} />
            <Paragraph content="Cette politique peut être mise à jour à tout moment. Vous serez informé de toute modification significative." />

            <Heading content="9. Contact" level={2} />
            <div className='contactus_link'>
                <Paragraph content="Pour toute question relative à cette politique de confidentialité, vous pouvez nous contacter " />
                <div onClick={() => navigate("/contactus")}>  en ciquant ici </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy