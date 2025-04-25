import { useState } from "react";
import axios from "../api/axios";

export default function CalorieGoalSettings() {
  const [goal, setGoal] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const updateGoal = async () => {
    setStatus("saving");
    try {
      await axios.put("/user/weekly-calorie-goal", { goal: parseInt(goal) });
      setStatus("saved");
    } catch (err) {
      console.error("❌ Failed to update goal", err);
    } finally {
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="font-bold mb-2">⚙️ Weekly Calorie Goal</h3>
      <input
        type="number"
        placeholder="e.g. 14000"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="border px-3 py-1 rounded mr-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <button onClick={updateGoal} className="bg-blue-600 text-white px-3 py-1 rounded">
        Save
      </button>
      {status === "saving" && <p className="text-sm text-gray-500 mt-1">Saving...</p>}
      {status === "saved" && <p className="text-sm text-green-500 mt-1">Updated ✅</p>}
    </div>
  );
}
