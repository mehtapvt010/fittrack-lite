import { useQuery } from "@tanstack/react-query";
import { fetchWorkoutStream } from "../api/metrics";

const WEEKLY_GOAL = 20000; // optional fallback

export default function WorkoutProgressBar({ goal = WEEKLY_GOAL }) {
  const { data = [] } = useQuery({
    queryKey: ["workoutStream"],
    queryFn: fetchWorkoutStream,
    refetchInterval: 5000,
  });

  const today = new Date().toISOString().slice(0, 10);
  const todayVolume = data
    .filter((entry) => entry.date === today)
    .reduce((acc, e) => acc + parseInt(e.volume), 0);

  const percent = Math.min((todayVolume / goal) * 100, 100);

  return (
    <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-md space-y-2">
      <h2 className="text-md font-bold">📈 Daily Progress</h2>
      <div className="w-full bg-gray-300 dark:bg-gray-700 h-4 rounded-full overflow-hidden">
        <div
          className="bg-emerald-500 h-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {todayVolume.toLocaleString()} kg lifted today
      </p>
      <div className="overflow-x-auto whitespace-nowrap text-sm mt-2">
        {data.map((entry) => (
          <span key={entry.id} className="inline-block mr-6 text-gray-500 dark:text-gray-300">
            {entry.exercise}: {entry.volume} kg
          </span>
        ))}
      </div>
    </div>
  );
}
