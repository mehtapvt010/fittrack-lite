import { useEffect, useState } from "react";
import { fetchThisWeekWorkouts } from "../api/workouts";
import { Workout } from "../types";
import { Card, CardContent } from "./ui/card";

function totalVolume(ws: Workout[]) {
  return ws.reduce(
    (sum, w) =>
      sum + w.sets.reduce((acc, s) => acc + s.reps * s.weight, 0),
    0
  );
}

export default function ThisWeekVolumeCard() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    fetchThisWeekWorkouts().then(setWorkouts);
  }, []);

  return (
    <Card className="w-full animate-in fade-in slide-in-from-bottom-5 duration-700">
      <CardContent className="p-6 space-y-2">
        <h2 className="text-xl font-bold">This Week’s Volume</h2>
        <p className="text-3xl font-extrabold">
          {totalVolume(workouts).toLocaleString()} kg
        </p>
      </CardContent>
    </Card>
  );
}
