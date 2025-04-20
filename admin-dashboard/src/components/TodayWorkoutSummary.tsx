import { useEffect, useState } from "react";
import { fetchTodayWorkouts } from "../api/workouts";
import { Workout } from "../types";
import { Card, CardContent } from "./ui/card";
import { format } from "date-fns";
import { LucideTrash2 } from "lucide-react";
import { deleteWorkout } from "../api/workouts";
import { Button } from "./ui/button";

function totalVolume(ws: Workout[]) {
  return ws.reduce(
    (sum, w) =>
      sum + w.sets.reduce((acc, s) => acc + s.reps * s.weight, 0),
    0
  );
}

export default function TodayWorkoutSummary() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    fetchTodayWorkouts().then(setWorkouts);
  }, []);

  // Sort by createdAt descending
  const sorted = [...workouts].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleDelete = async (id: string) => {
    await deleteWorkout(id);
    const updated = workouts.filter((w) => w.id !== id);
    setWorkouts(updated);
  };

  return (
    <Card className="w-full animate-in fade-in zoom-in duration-700">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Today’s Volume</h2>
        <p className="text-3xl font-extrabold">
          {totalVolume(sorted).toLocaleString()} kg
        </p>

        <div className="divide-y border-t mt-4">
          {sorted.map((w) => (
            <div key={w.id} className="py-2">
              <div className="font-semibold">{w.exercise}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
              {w.sets.map((s, idx) => (
              <span key={idx} className="inline-block mr-3">
                {s.reps} × {s.weight}kg
                <Button
                  variant="ghost"
                  className="text-red-500 p-1 hover:bg-red-100 dark:hover:bg-gray-800"
                  onClick={() => handleDelete(w.id)}
                >
                  <LucideTrash2 size={18} />
                </Button>

              </span>
            ))}
              </div>
              <div className="text-xs text-muted-foreground italic">
                Logged at {format(new Date(w.createdAt), "hh:mm a")}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
