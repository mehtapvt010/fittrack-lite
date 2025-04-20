export interface Workout {
    id: string;
    userId: string;
    date: string; // ISO string or "YYYY-MM-DD"
    exercise: string;
    sets: { reps: number; weight: number }[];
    createdAt: string;
  }