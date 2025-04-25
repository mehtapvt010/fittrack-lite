import axios from "./axios";

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
}

export async function fetchTodayMeals(): Promise<Meal[]> {
  const res = await axios.get("/meals/today");
  return res.data;
}

export const fetchWeekMeals = async (): Promise<Meal[]> => {
  const res = await axios.get("/meals/week");
  return res.data;
};

export const fetchMacroSummary = async (): Promise<{
  goal: number;
  actual: number;
}> => {
  const res = await axios.get("/meals/week-summary");
  return res.data;
};

export const fetchMacroBreakdown = async (): Promise<{
  protein: number;
  carbs: number;
  fat: number;
}> => {
  const res = await axios.get("/meals/macro-summary");
  return res.data;
};

export const fetchMacroTargets = async (): Promise<{
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
}> => {
  const res = await axios.get("/user/macro-goals");
  return res.data;
};
