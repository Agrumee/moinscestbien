import { useState } from "react";
import ConsumptionsChart from "../../atoms/ConsumptionsChart/ConsumptionsChart";
import "./HabitPanel.scss";
import CountButton from "../../molecules/CountButton/CountButton";
import Input from "../../atoms/Input/Input";
import CalendarButton from "../../molecules/CalendarButton/CalendarButton";
import Paragraph from "../../atoms/Paragraph/Paragraph";
import Button from "../../atoms/Button/Button";
import Heading from "../../atoms/Heading/Heading";
import Modal from "../../molecules/Modal/Modal";
import { Frequency, TrackedHabit } from "../../../types/tracked-habit.model";
import { Consumption } from "../../../types/consumption.model";

interface HabitPanelProps {
    trackedHabit: TrackedHabit;
    consumptions: Consumption[];
    currentConsumption: number;
    frequency: Frequency;
    onDateChange: (date: string) => void;
    onUpdateConsumption: (quantity: number) => void;
    deleteTracking: () => void;
    pauseTracking?: () => void;
}

const HabitPanel = ({
    trackedHabit,
    consumptions,
    currentConsumption,
    frequency,
    onDateChange,
    onUpdateConsumption,
    deleteTracking,
    pauseTracking,
}: HabitPanelProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentFrequency, setCurrentFrequency] = useState<
        Frequency
    >(frequency);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const handleDateChange = (selectedDate: Date | null) => {
        if (selectedDate) {
            setCurrentDate(selectedDate);
            const formattedDate = formatDate(selectedDate);
            onDateChange(formattedDate);
        }
    };

    const updateInputValue = (value: number) => {
        onUpdateConsumption(currentConsumption + value);
    };

    const handlePauseTracking = () => {
        if (pauseTracking) {
            pauseTracking()
        }
    }

    const handleDeleteClick = () => {
        setIsModalOpen(true); // Ouvre la modal
    };

    const handleModalConfirm = () => {
        setIsModalOpen(false); // Ferme la modal
        deleteTracking(); // Exécute la suppression
    };

    const handleModalCancel = () => {
        setIsModalOpen(false); // Ferme la modal sans action
    };

    return (
        <div className="o-habitpanel" key={trackedHabit.id}>
            <div className="o-habitpanel_title">
                <Heading
                    level={2}
                    color="white"
                    content={trackedHabit.habit.label}
                    className="o-habitpanel__title__text"
                />
            </div>

            <div className="o-habitpanel__content">
                <div className="o-habitpanel__control">
                    <div className="o-habitpanel__content__dates">
                        <CalendarButton
                            initialDate={currentDate}
                            onDateChange={handleDateChange}
                            startDate={trackedHabit.start_date}
                        />
                    </div>
                    <div className="o-habitpanel__content__counter">
                        <CountButton
                            operation="minus"
                            onClick={() => updateInputValue(-1)}
                        />
                        <Input
                            className="small-input"
                            value={currentConsumption.toString()}
                            onChange={(e) => onUpdateConsumption(Number(e.target.value))}
                        />

                        <CountButton operation="plus" onClick={() => updateInputValue(1)} />
                    </div>

                    <div className="o-habitpanel__content__footer">
                        <Button
                            className="o-habitpanel__content__footer__button -pause"
                            variant="tertiary"
                            size="small"
                            content="Mettre en pause"
                            onClick={handlePauseTracking}
                        />
                        <Button
                            className="o-habitpanel__content__footer__button -delete"
                            variant="secondary"
                            size="small"
                            content="Ne plus suivre"
                            onClick={handleDeleteClick}
                        />
                    </div>
                </div>
                <div className="o-habitpanel__content__chart__block">
                    {consumptions.length <= 1 ? (
                        <div className="o-habitpanel__content__noData">
                            <Paragraph
                                color="white"
                                content="Entrez vos premières données pour commencer à suivre votre consommation."
                            />
                        </div>
                    ) : (
                        <>
                            <ConsumptionsChart
                                className="o-habitpanel__content__chart"
                                consumptions={consumptions}
                                frequency={currentFrequency}
                            />

                            <div className="o-habitpanel__content__frequency">
                                <Button
                                    variant={
                                        currentFrequency === "daily" ? "primary" : "tertiary"
                                    }
                                    size="tiny"
                                    content="Par jour"
                                    onClick={() => setCurrentFrequency("daily")}
                                />
                                <Button
                                    variant={
                                        currentFrequency === "weekly" ? "primary" : "tertiary"
                                    }
                                    size="tiny"
                                    content="Par semaine"
                                    onClick={() => setCurrentFrequency("weekly")}
                                />
                                <Button
                                    variant={
                                        currentFrequency === "monthly" ? "primary" : "tertiary"
                                    }
                                    size="tiny"
                                    content="Par mois"
                                    onClick={() => setCurrentFrequency("monthly")}
                                />
                            </div>
                        </>
                    )}

                </div>
            </div>
            {isModalOpen && (
                <Modal
                    message="Êtes-vous sûr(e) de vouloir arrêter ce suivi ? Vos données seront définitivement supprimées."
                    onCancel={handleModalCancel}
                    onConfirm={handleModalConfirm}
                />
            )}
        </div >
    );
}

export default HabitPanel;