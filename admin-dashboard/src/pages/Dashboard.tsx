import Navbar from "../components/Navbar";
import ThisWeekVolumeCard from "../components/ThisWeekVolumeCard";
import TodayWorkoutSummary from "../components/TodayWorkoutSummary";
import { useEffect, useState } from "react";
import WeeklyVolumeChart from "../components/WeeklyVolumeChart";
import StreakCard from "../components/StreakCard";
import ExerciseVolumeChart from "../components/ExerciseVolumeChart";
import GoalProgressCard from "../components/GoalProgressCard";

const Dashboard = () => {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("seenWelcome");
    if (!seen) {
      setShowWelcome(true);
      localStorage.setItem("seenWelcome", "true");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-black dark:text-white transition-colors duration-300">
      <Navbar />

      {showWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center">
            <h2 className="text-2xl font-bold mb-2">Welcome to FitTrack Lite!</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              We’re excited to help you track your workouts and macros. Let’s get started!
            </p>
            <button
              onClick={() => setShowWelcome(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Let’s Go
            </button>
          </div>
        </div>
      )}

      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Your Dashboard</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Welcome to FitTrack Lite! From here you’ll be able to track your workouts,
          sync meals, and view insights over time. Let’s build some consistency 💪
        </p>

        <img
          src="/fitness-stats.svg" 
          alt="Fitness tracking illustration"
          className="w-full max-w-md mx-auto mt-10"
        />
        <div className="max-w-4xl mx-auto space-y-6 mt-10 px-4">
          <StreakCard />
          <TodayWorkoutSummary />
          <ThisWeekVolumeCard />
          <WeeklyVolumeChart />
          <ExerciseVolumeChart />
          <GoalProgressCard />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
