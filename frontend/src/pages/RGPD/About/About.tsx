import Heading from "../../../components/atoms/Heading/Heading";
import Paragraph from "../../../components/atoms/Paragraph/Paragraph";

import "./About.scss";

const About = () => {
    return (
        <div className="p-about">
            <Heading level={1} content="Moins c'est bien" color="black" />
            <Heading level={2} content="L’application qui vous challenge dans vos habitudes de consommation !" />

            <img src="/illustration/flowers.png" alt="Illustration florale de l'application" />

            <section className="presentation">
                <Heading level={3} content="Qui sommes-nous ?" />
                <div className="creators">
                    <a href='https://www.linkedin.com/in/mehdi-grimault/'>
                        <Paragraph className="href-link" content="Mehdi Grimault" size="medium" />
                    </a>
                    <a href="https://www.linkedin.com/in/clementineriviere/">
                        <Paragraph className="href-link" content="Clémentine Rivière" size="medium" />
                    </a>
                </div>
                <Paragraph content="Étudiants à Ada Tech School" size="tiny" />
            </section>

            <section className="history">
                <Heading className="history_title" level={3} content="Histoire" />
                <Paragraph content="Entre mars 2024 et février 2025, nous avons travaillé au développement de Moins c’est bien, un projet de fin d'études réalisé dans la cadre de notre présentation au titre RNCP Concepteur et Développeur d'Applications." />
                <Paragraph content="Cette démarche a été motivée par notre réflexion autour des problématiques de la surconsommation et de ses multiples conséquences, qu’elles soient environnementales, éthiques, sanitaires ou financières." />
                <Paragraph content="Avec Moins c’est bien, notre objectif est de proposer un outil simple, accessible sur mobile comme sur ordinateur, et non culpabilisant, qui permet de :" />
                <ul>
                    <li>Choisir les habitudes que l’on souhaite suivre</li>
                    <li>Enregistrer nos consommations</li>
                    <li>Visualiser graphiquement celles-ci</li>
                    <li>Atteindre nos objectifs en focalisant sur nos motivations personnelles</li>
                </ul>
            </section>
        </div>
    );
};

export default About;
