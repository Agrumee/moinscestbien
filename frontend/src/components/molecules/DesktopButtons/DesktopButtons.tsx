import Button from '../../atoms/Button/Button';
import { TrackedHabit } from '../../../types/tracked-habit.model';
import "./DesktopButtons.scss"

interface DesktopButtonsProps {
    trackedHabits: TrackedHabit[];
    setCurrentTrackedHabit: (trackedHabit: TrackedHabit) => void;
    setEnabledTrackedHabits: (id: number) => void;
    enabledTrackedHabits: number[];
}
const DesktopButtons = ({ trackedHabits, setCurrentTrackedHabit, setEnabledTrackedHabits, enabledTrackedHabits
}: DesktopButtonsProps) => {
    const chunkArray = (array: TrackedHabit[], size: number) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    };

    const habitChunks = chunkArray(trackedHabits, 4);

    return (
        <div className="desktop-buttons">
            {habitChunks.map((chunk, index) => (
                <div key={index} className="button-row">
                    {chunk.map((trackedHabit: TrackedHabit) => (
                        <Button
                            key={trackedHabit.id}
                            className="desktop-button"
                            variant="primary"
                            size="small"
                            content={trackedHabit.habit.label}
                            onClick={() => {
                                setCurrentTrackedHabit(trackedHabit)
                                if (!enabledTrackedHabits.includes(trackedHabit.id)) setEnabledTrackedHabits(trackedHabit.id)
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default DesktopButtons;
