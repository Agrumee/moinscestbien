import { TrackedHabit } from "./tracked-habit.model";

export type Consumption = {
    quantity: number;
    date: Date;
    tracked_habit: TrackedHabit;
}

// indexed type
export type ConsumptionsListByTrackedHabitId = {
    [key: number]: Consumption[];
}


