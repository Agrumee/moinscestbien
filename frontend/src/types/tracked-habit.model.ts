export type Habit = {
    id: number;
    name: string;
    label: string;
};

export type Unit = {
    id: number;
    name: string;
    label: string;
    code : string;
};

export type Motivation = {
    id: number;
    name: string;
    label: string;

};

export type TrackingFrequency = {
    id: number;
    name: Frequency;
    label:string;
};

export type Frequency = "daily" | "weekly" | "monthly";


export type TrackedHabit = {
    id: number;
    habit: Habit;
    unit: Unit;
    motivation: Motivation;
    tracking_frequency: TrackingFrequency;
    start_date: Date;
    end_date: Date | null;
};


