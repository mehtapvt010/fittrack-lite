import { useQuery } from "@tanstack/react-query";
import { fetchMacroSummary } from "../api/meals";

export default function MacroGoalProgress() {
  const { data, isLoading } = useQuery({
    queryKey: ["macroSummary"],
    queryFn: fetchMacroSummary,
  });

  const progress = data ? Math.min(100, Math.round((data.actual / data.goal) * 100)) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <h3 className="font-bold mb-2">🎯 Weekly Goal Progress</h3>
      {isLoading ? (
        <p className="text-gray-500">Loading progress...</p>
      ) : (
        <>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
            {data?.actual} / {data?.goal} kcal ({progress}%)
          </p>
        </>
      )}
    </div>
  );
}
