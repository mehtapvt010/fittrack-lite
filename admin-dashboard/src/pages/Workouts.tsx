import WorkoutForm from "../components/WorkoutForm";
import Navbar from "../components/Navbar";

export default function Workouts() {
  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6 text-center">Log Your Workout</h1>
      <WorkoutForm />
    </div>
  );
}
