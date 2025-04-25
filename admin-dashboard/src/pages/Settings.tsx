import { useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";

export default function SettingsPage() {
  const [values, setValues] = useState({
    calorie: "",
    protein: "",
    carbs: "",
    fat: "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const update = async () => {
    setStatus("saving");
    try {
      await axios.put("/user/macro-goals", {
        ...Object.fromEntries(
          Object.entries(values).map(([k, v]) => [k, parseInt(v)])
        ),
      });
      setStatus("saved");
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-black dark:text-white p-6">
        <Navbar />
      <h1 className="text-2xl font-bold mb-4">⚙️ Macro & Calorie Goals</h1>
      <div className="space-y-4">
        {["calorie", "protein", "carbs", "fat"].map((key) => (
          <div key={key}>
            <label className="block text-sm font-semibold capitalize">{key}</label>
            <input
              type="number"
              value={values[key as keyof typeof values]}
              onChange={(e) => setValues({ ...values, [key]: e.target.value })}
              className="w-full border rounded p-2 mt-1 dark:bg-gray-800 dark:border-gray-600"
              placeholder={`Enter ${key} goal`}
            />
          </div>
        ))}
        <button
          onClick={update}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow mt-2"
        >
          Save Goals
        </button>
        {status === "saving" && <p>Saving...</p>}
        {status === "saved" && <p className="text-green-500">Saved ✅</p>}
      </div>
    </div>
  );
}
