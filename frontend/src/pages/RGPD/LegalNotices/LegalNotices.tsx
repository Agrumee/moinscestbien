import Heading from '../../../components/atoms/Heading/Heading'
import Paragraph from '../../../components/atoms/Paragraph/Paragraph'

import './LegalNotices.scss'

const LegalNotices = () => {
    return (
        <div className='p-legalnotices'>
            <Heading content='Mentions Légales' level={1} />

            <Heading content="1. Éditeur de l'application" level={2} />

            <Paragraph content="L'application 'Moins c'est bien' est un projet étudiant développé à des fins pédagogiques et non commerciales." />
            <Paragraph content='Responsable du projet : Grimault Mehdi, Rivière Clémentine' />
            <div className='contactus_link'>
                <Paragraph content="Pour nous contacter : " />
                <a href="./contactus"> cliquez ici</a>
            </div>

            <Heading content="2. Hébergement" level={2} />

            <Paragraph content="L'application est hébergée par :Nom de l'hébergeur : [Nom de l'hébergeur]Adresse : [Adresse de l'hébergeur]" />

            <Heading content="3. Propriété intellectuelle" level={2} />

            <Paragraph content="Tous les contenus présents sur l'application, y compris les textes, images, logos et graphismes, sont la propriété de leurs auteurs respectifs. Toute reproduction ou utilisation sans autorisation est interdite." />

            <Heading content="4. Protection des données personnelles" level={2} />

            <Paragraph content="L'application collecte des données personnelles uniquement pour son bon fonctionnement et ne les partage pas avec des tiers. Pour plus de détails, veuillez consulter notre Politique de Confidentialité." />

            <Heading content="5. Responsabilité" level={2} />

            <Paragraph content="L'application 'Moins c'est bien' est un outil destiné à accompagner les utilisateurs dans l'évolution de leurs habitudes de consommation. Cependant, les informations fournies sont indicatives et ne constituent pas un avis professionnel. L'équipe du projet ne saurait être tenue responsable de l'utilisation des données par les utilisateurs." />

            <Heading content="6. Contact" level={2} />

            <div className='contactus_link'>
                <Paragraph content="Pour toute question ou demande d'information, vous pouvez nous contacter à l'adresse suivante : " />
                <a href="./contactus"> en ciquant ici </a>
            </div>



        </div>
    )
}

export default LegalNotices