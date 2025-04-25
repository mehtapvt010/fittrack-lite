import axios from "./axios";

/** GET /api/metrics/volume  → number */
export const fetchTodayVolume = () =>
  axios.get<number>("/metrics/volume").then((r) => r.data);

/** GET /api/metrics/exercises  → { exercise, createdAt }[] */
export const fetchTodayExercises = () =>
  axios.get<{ exercise: string; createdAt: string }[]>(
    "/metrics/exercises",
  ).then((r) => r.data);

export const fetchYesterdayVolume = () =>
  axios.get<number>("/metrics/volume/yesterday").then((r) => r.data);

export const fetchGoalStatus = () =>
  axios.get<{ reached: boolean }>("/metrics/goal-status").then((r) => r.data.reached);

export const fetchWorkoutStream = () =>
  axios.get<{ id: string; date: string; exercise: string; volume: string }[]>(
    "/metrics/progress-stream"
  ).then((r) => r.data);


  
