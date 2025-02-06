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
                    <Paragraph content="Mehdi Grimault" size="big" />
                    <Paragraph content="Clémentine Rivière" size="big" />
                </div>
                <Paragraph content="Étudiants à Ada Tech School" size="small" />
            </section>

            <section className="history">
                <Heading className="history_title" level={3} content="Histoire" />
                <Paragraph content="Entre mars 2024 et février 2025, nous avons travaillé au développement de Moins c’est bien, notre projet de fin d'études afin de prétendre au titre RNCP Concepteur et Développeur d'Applications." />
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
