import axios from "./axios";
import { CreateWorkoutInput } from "../../../backend/validators/workout"; // path alias ok if tsconfig paths set
import { Workout } from "../types";

export const createWorkout = (data: CreateWorkoutInput) =>
  axios.post("/workouts", data).then((r: any) => r.data);

export const fetchTodayWorkouts = async () => {
  try {
    const res = await axios.get("/workouts/today");
    return Array.isArray(res.data) ? res.data as Workout[] : [];
  } catch (err) {
    console.error("Failed to fetch workouts", err);
    return [];
  }
};

export const fetchThisWeekWorkouts = () =>
  axios.get("/workouts/week").then((r) => r.data as Workout[]);

export const deleteWorkout = (id: string) =>
  axios.delete(`/workouts/${id}`).then((r) => r.data);

export const fetchWorkoutDates = (): Promise<string[]> =>
  axios.get("/workouts/dates").then((r) => r.data);

export const fetchAllWorkouts = () =>
  axios.get("/workouts/all").then((r) => r.data as Workout[]);


