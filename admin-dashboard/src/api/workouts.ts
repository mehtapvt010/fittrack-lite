import axios from "./axios";
import { CreateWorkoutInput } from "../../../backend/validators/workout"; // path alias ok if tsconfig paths set
import { Workout } from "../types";
import { QueryClient } from "@tanstack/react-query";


const queryClient = new QueryClient();

export const createWorkout = async (data: CreateWorkoutInput) => {
  //console.log("✅ Workout created", data);
  await axios.post("/workouts", data);
  await queryClient.invalidateQueries({ queryKey: ["todayVolume"] });
  await queryClient.invalidateQueries({ queryKey: ["todayExercises"] });
  await queryClient.invalidateQueries({ queryKey: ["weekWorkouts"] });
};

export const deleteWorkout = async (id: string) => {
  await axios.delete(`/workouts/${id}`);
  await queryClient.invalidateQueries({ queryKey: ["todayVolume"] });
  await queryClient.invalidateQueries({ queryKey: ["todayExercises"] });
  await queryClient.invalidateQueries({ queryKey: ["weekWorkouts"] });
};

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

export const fetchWorkoutDates = (): Promise<string[]> =>
  axios.get("/workouts/dates").then((r) => r.data);

export const fetchAllWorkouts = () =>
  axios.get("/workouts/all").then((r) => r.data as Workout[]);


