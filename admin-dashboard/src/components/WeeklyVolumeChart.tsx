import { useEffect, useState } from "react";
import { fetchThisWeekWorkouts } from "../api/workouts";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format, subDays } from "date-fns";

function eachDayOfInterval(start: Date, end: Date): Date[] {
    const days = [];
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }
    return days;
}

export default function WeeklyVolumeChart() {
  const [data, setData] = useState<{ date: string; volume: number }[]>([]);

  useEffect(() => {
    fetchThisWeekWorkouts().then((workouts) => {
      const today = new Date();
      const sevenDaysAgo = subDays(today, 6);

      // Pre-fill 7 days with 0 volume
      const days = eachDayOfInterval(
        sevenDaysAgo,
        today,
      ).map((date) => ({
        date: format(date, "EEE"), // Mon, Tue...
        iso: format(date, "yyyy-MM-dd"),
        volume: 0,
      }));

      // Sum volume per day
      for (const w of workouts) {
        const day = format(new Date(w.date), "yyyy-MM-dd");
        const target = days.find((d) => d.iso === day);
        if (target) {
          const workoutVolume = w.sets.reduce((sum, s) => sum + s.reps * s.weight, 0);
          target.volume += workoutVolume;
        }
      }

      setData(days.map(({ date, volume }) => ({ date, volume })));
    });
  }, []);

  return (
    <div className="w-full h-64 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Last 7 Days Volume</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="volume" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
