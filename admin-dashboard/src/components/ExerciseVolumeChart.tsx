import { useEffect, useState } from "react";
import { fetchThisWeekWorkouts } from "../api/workouts";
import { Workout } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

export default function ExerciseVolumeChart() {
  const [data, setData] = useState<{ exercise: string; volume: number }[]>([]);

  useEffect(() => {
    fetchThisWeekWorkouts().then((workouts: Workout[]) => {
      const volumeMap: Record<string, number> = {};

      for (const w of workouts) {
        const vol = w.sets.reduce((sum, s) => sum + s.reps * s.weight, 0);
        volumeMap[w.exercise] = (volumeMap[w.exercise] || 0) + vol;
      }

      const formatted = Object.entries(volumeMap).map(([exercise, volume]) => ({
        exercise,
        volume,
      }));

      setData(formatted);
    });
  }, []);

  return (
    <div className="w-full h-64 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Volume by Exercise</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="exercise" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="volume" fill="#6366f1" radius={[0, 8, 8, 0]}>
            <LabelList dataKey="volume" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
