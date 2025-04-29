import { fetchThisWeekWorkouts } from "../api/workouts";
import { Workout } from "../types";
import { Card, CardContent } from "./ui/card";
import { useQuery } from "@tanstack/react-query";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { Button } from "./ui/button";

const exportToPDF = async () => {
  const element = document.getElementById("weekly-summary");
  if (!element) {
    alert("Summary section not found!");
    return;
  }

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const imgWidth = 190;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  pdf.save("weekly-summary.pdf");
};


function totalVolume(ws: Workout[]) {
  return ws.reduce(
    (sum, w) =>
      sum + w.sets.reduce((acc, s) => acc + s.reps * s.weight, 0),
    0
  );
}

export default function ThisWeekVolumeCard() {

  const {
    data: workouts = [],
    isFetching,
  } = useQuery({
    queryKey: ["weekWorkouts"],
    queryFn: fetchThisWeekWorkouts,
    refetchInterval: 5000,     // ← every 5 s, matches Redis TTL
    staleTime: 4000,           // keep it “fresh” in cache just shy of 5 s
  });

  return (
    <Card className="w-full bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 shadow-xl dark:shadow-sm dark:shadow-black/40 rounded-2xl">
      <CardContent className="p-6 space-y-2"> 
        <h2 className="text-xl font-bold">This Week’s Volume</h2>
        <p className="text-3xl font-extrabold flex items-center gap-2">
          {totalVolume(workouts).toLocaleString()} kg
          {/* “Live” ping while background refetch is happening */}
          {isFetching && (
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
          )}
        </p>
      </CardContent>
      <CardContent className="p-6 space-y-2">
      <div id="weekly-summary" className="rounded-xl">
          <h2 className="text-xl font-bold mb-2">Weekly Summary</h2>
          <span>Content TBD</span>
          <div className="mt-3">
            <Button onClick={exportToPDF} className="mb-2">Download Weekly Report</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
