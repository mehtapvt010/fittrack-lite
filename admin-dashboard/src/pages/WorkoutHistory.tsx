import { useEffect, useState } from "react";
import { fetchAllWorkouts } from "../api/workouts";
import { Workout } from "../types";
import { format } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';
import { isWithinInterval } from 'date-fns/isWithinInterval';
import { Button } from "../components/ui/button";
import DarkModeToggle from "../components/DarkModeToggle";
import Navbar from "../components/Navbar";

export default function WorkoutHistory() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [sortBy, setSortBy] = useState<"date" | "exercise">("date");
  const [sortAsc, setSortAsc] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAllWorkouts().then(setWorkouts);
  }, []);

  const filtered = workouts.filter((w) => {
    const matchesSearch = w.exercise.toLowerCase().includes(search.toLowerCase());

    const matchesDate =
      !startDate || !endDate
        ? true
        : isWithinInterval(parseISO(w.date), {
            start: parseISO(startDate),
            end: parseISO(endDate),
          });

    return matchesSearch && matchesDate;
  });

  const sorted = [...filtered].sort((a, b) => {
    let v1 = sortBy === "date" ? new Date(a.date) : a.exercise.toLowerCase();
    let v2 = sortBy === "date" ? new Date(b.date) : b.exercise.toLowerCase();
    if (v1 < v2) return sortAsc ? -1 : 1;
    if (v1 > v2) return sortAsc ? 1 : -1;
    return 0;
  });

  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportCSV = () => {
    const header = "Date,Exercise,Reps×Weight\n";
    const rows = sorted.map((w) => {
      const date = format(new Date(w.date), "yyyy-MM-dd");
      const sets = w.sets.map((s) => `${s.reps}×${s.weight}`).join(" | ");
      return `${date},${w.exercise},"${sets}"`;
    });
    const csv = header + rows.join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workout-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 space-y-6">
      <Navbar />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Workout History</h1>
        <Button onClick={exportCSV}>📥 Export CSV</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <input
          type="text"
          placeholder="Search exercise..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-1/2 p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="overflow-auto rounded-lg border dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300">
            <tr>
              <th
                className="cursor-pointer text-left p-3"
                onClick={() => {
                  setSortBy("date");
                  setSortAsc(sortBy === "date" ? !sortAsc : false);
                }}
              >
                Date {sortBy === "date" && (sortAsc ? "↑" : "↓")}
              </th>
              <th
                className="cursor-pointer text-left p-3"
                onClick={() => {
                  setSortBy("exercise");
                  setSortAsc(sortBy === "exercise" ? !sortAsc : false);
                }}
              >
                Exercise {sortBy === "exercise" && (sortAsc ? "↑" : "↓")}
              </th>
              <th className="text-left p-3">Sets</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            {paginated.map((w) => (
              <tr key={w.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-3">{format(new Date(w.date), "yyyy-MM-dd")}</td>
                <td className="p-3 font-medium">{w.exercise}</td>
                <td className="p-3">
                  {w.sets.map((s, i) => (
                    <span key={i} className="inline-block mr-2">
                      {s.reps}×{s.weight}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-4 mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          ← Prev
        </Button>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Page {currentPage} of {Math.ceil(sorted.length / itemsPerPage)}
        </span>
        <Button
          disabled={currentPage * itemsPerPage >= sorted.length}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
