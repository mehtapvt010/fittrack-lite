import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { fetchTodayWorkouts, deleteWorkout } from "../api/workouts";
import { fetchTodayVolume, fetchYesterdayVolume } from "../api/metrics";
import { format } from "date-fns";
import { Card, CardContent } from "./ui/card";
import { LucideTrash2 } from "lucide-react";
import { Button } from "./ui/button";
import { queryClient } from "../main";
import Skeleton from "./ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";
import { fetchGoalStatus } from "../api/metrics";
import { useAuth } from "../context/AuthContext";

export default function TodayWorkoutSummary() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { user } = useAuth();
  
  // 🔁 Live volume from Redis
  const { data: cachedVolume, isFetching: volumeLoading } = useQuery({
    queryKey: ["todayVolume"],
    queryFn: fetchTodayVolume,
    refetchInterval: 5000,
    staleTime: 4000,
  });

  useEffect(() => {
    if (cachedVolume !== undefined) {
      setLastUpdated(new Date());
    }
  }, [cachedVolume]);

  // 🔁 Live workout list (for reps, weight, etc.)
  const {
    data: workouts = [],
    isFetching: workoutsLoading,
  } = useQuery({
    queryKey: ["todayWorkouts"],
    queryFn: fetchTodayWorkouts,
    refetchInterval: 5000,
    staleTime: 4000,
  });

  const { data: yesterdayVolume = 0 } = useQuery({
    queryKey: ["yesterdayVolume"],
    queryFn: fetchYesterdayVolume,
    staleTime: 60_000,
  });

  const goalToastShown = useRef(false); // 🍞 make sure toast only fires once

  const { data: goalReached } = useQuery({
    queryKey: ["goalStatus"],
    queryFn: fetchGoalStatus,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (goalReached && !goalToastShown.current) {
      toast.success("🎉 Congrats! Weekly goal reached!");
      goalToastShown.current = true;
    }
  }, [goalReached]);

  useEffect(() => {
    goalToastShown.current = false; // optional: reset on user switch
  }, [user?.id]);

  const delta = cachedVolume && yesterdayVolume !== undefined
  ? cachedVolume - yesterdayVolume
  : null;

const deltaClass =
  delta === null
    ? ""
    : delta > 0
    ? "text-green-600"
    : "text-red-500";

const deltaIcon = delta === null ? "" : delta > 0 ? "⬆" : "⬇";
  

  const getTimeAgo = () => {
    if (!lastUpdated) return null;
    const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const mins = Math.floor(seconds / 60);
    return `${mins}m ago`;
  };

  const sorted = [...workouts].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleDelete = async (id: string) => {
    await deleteWorkout(id);
    await queryClient.invalidateQueries({ queryKey: ["todayWorkouts"] });
    await queryClient.invalidateQueries({ queryKey: ["todayVolume"] });
    await queryClient.invalidateQueries({ queryKey: ["todayExercises"] });
  };

  return (
    <Card className="w-full bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Today’s Volume
          {(volumeLoading || workoutsLoading) && (
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
          )}
          {cachedVolume !== undefined && delta !== null && (
            <div className={`text-sm font-medium ${deltaClass}`}>
              {deltaIcon} {Math.abs(delta).toLocaleString()} kg vs yesterday
            </div>
          )}
        </h2>

        {volumeLoading ? (
          <Skeleton className="h-8 w-40 mb-2" />
        ) : (
          <>
            <p className="text-3xl font-extrabold">
              {(cachedVolume ?? 0).toLocaleString()} kg
            </p>
            {lastUpdated && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                🕒 Last updated {getTimeAgo()}
              </p>
            )}
          </>
        )}

        <div className="divide-y border-t mt-4">
          {workoutsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-5 w-1/4 mt-4" />
            </div>
          ) : sorted.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No workouts logged today.
            </p>
          ) : (
            sorted.map((w) => (
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
