import { useQuery } from "@tanstack/react-query";
import { fetchWeekMeals, Meal } from "../api/meals";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

export default function WeeklyMealChart() {
  const { data: meals = [], isLoading } = useQuery<Meal[]>({
    queryKey: ["weekMeals"],
    queryFn: fetchWeekMeals,
  });

  const days = [...Array(7)].map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const formatted = format(date, "EEE"); // e.g., Mon
    const calories = meals
      .filter((m) => new Date(m.createdAt).toDateString() === date.toDateString())
      .reduce((sum, m) => sum + m.calories, 0);

    return { day: formatted, calories };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <h3 className="font-bold mb-2">📊 Weekly Calories</h3>
      {isLoading ? (
        <p className="text-gray-500">Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={days}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="calories" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
