import { useQuery } from "@tanstack/react-query";
import { fetchMacroBreakdown, fetchMacroTargets } from "../api/meals";

export default function MacroBreakdownCard() {
  const { data: actuals, isLoading: loadingActuals } = useQuery({
    queryKey: ["macroBreakdown"],
    queryFn: fetchMacroBreakdown,
  });

  const { data: targets, isLoading: loadingTargets } = useQuery({
    queryKey: ["macroTargets"],
    queryFn: fetchMacroTargets,
  });

  if (loadingActuals || loadingTargets) return <p>Loading macros...</p>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <h3 className="font-bold mb-2">🍽️ Weekly Macro Summary</h3>
      <ul className="text-sm space-y-1">
        {["protein", "carbs", "fat"].map((key) => (
          <li key={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
            {actuals?.[key as keyof typeof actuals]}g /{" "}
            {targets?.[`${key}Target` as keyof typeof targets]}g
          </li>
        ))}
      </ul>
    </div>
  );
}
