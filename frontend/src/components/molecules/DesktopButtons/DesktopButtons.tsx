import Button from '../../atoms/Button/Button';
import { TrackedHabit } from '../../../types/tracked-habit.model';
import "./DesktopButtons.scss"

interface DesktopButtonsProps {
    trackedHabits: TrackedHabit[];
    setCurrentTrackedHabit: (habit: TrackedHabit) => void;
}
const DesktopButtons = ({ trackedHabits, setCurrentTrackedHabit }: DesktopButtonsProps) => {
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
                            onClick={() => setCurrentTrackedHabit(trackedHabit)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default DesktopButtons;
