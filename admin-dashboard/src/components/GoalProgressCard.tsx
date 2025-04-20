import { useEffect, useState } from "react";
import { fetchThisWeekWorkouts } from "../api/workouts";
import { Workout } from "../types";
import { Card, CardContent } from "./ui/card";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

function calculateVolume(ws: Workout[]) {
  return ws.reduce(
    (sum, w) =>
      sum + w.sets.reduce((acc, s) => acc + s.reps * s.weight, 0),
    0
  );
}

export default function GoalProgressCard() {
  const { user, setUser } = useAuth();
  const [volume, setVolume] = useState(0);
  const [editing, setEditing] = useState(false);
  const [goal, setGoal] = useState(user?.weeklyGoal || 20000);

  useEffect(() => {
    fetchThisWeekWorkouts().then((ws) => {
      setVolume(calculateVolume(ws));
    });
  }, []);

  useEffect(() => {
    if (user?.weeklyGoal) setGoal(user.weeklyGoal);
  }, [user]);

  const percent = Math.min((volume / goal) * 100, 100);

  const saveGoal = async () => {
    const res = await axios.patch("/user/goal", { goal });
    setUser((u) => (u ? { ...u, weeklyGoal: res.data.weeklyGoal } : u));
    setEditing(false);
  };

  return (
    <Card className="w-full animate-in fade-in zoom-in duration-700">
      <CardContent className="p-6 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Weekly Goal Progress</h2>
          {editing ? (
            <div className="flex gap-2">
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
                className="w-24 px-2 py-1 border rounded dark:bg-gray-800 dark:text-white"
              />
              <button
                onClick={saveGoal}
                className="text-green-600 font-medium hover:underline"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="text-blue-600 text-sm hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 h-4 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 dark:bg-green-400 transition-all"
            style={{ width: `${percent}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {volume.toLocaleString()} kg / {goal.toLocaleString()} kg
        </p>
      </CardContent>
    </Card>
  );
}
