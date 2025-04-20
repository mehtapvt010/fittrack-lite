import { useEffect, useState } from "react";
import { fetchWorkoutDates } from "../api/workouts";
import { Card, CardContent } from "./ui/card";
import { format, subDays } from "date-fns";

function calculateStreak(dates: string[]): number {
  const today = new Date();
  const dateSet = new Set(dates);

  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const day = format(subDays(today, i), "yyyy-MM-dd");
    if (dateSet.has(day)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default function StreakCard() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    fetchWorkoutDates().then((dates) => {
      setStreak(calculateStreak(dates));
    });
  }, []);

  return (
    <Card className="w-full animate-in fade-in slide-in-from-top-4 duration-700">
      <CardContent className="p-6">
        {streak > 0 ? (
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            🔥 You're on a {streak}-day streak!
          </p>
        ) : (
          <p className="text-lg font-medium text-gray-500">
            💤 No current streak – log a workout today!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
