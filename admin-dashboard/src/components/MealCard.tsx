import { Meal } from "../api/meals";

interface MealCardProps {
  meal: Meal;
}

export default function MealCard({ meal }: MealCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <div className="font-semibold text-lg">{meal.name}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {meal.calories} kcal — {meal.protein}g protein, {meal.carbs}g carbs, {meal.fat}g fat
      </div>
      <div className="text-xs text-gray-400 mt-1">
        Logged at {new Date(meal.createdAt).toLocaleTimeString()}
      </div>
    </div>
  );
}
