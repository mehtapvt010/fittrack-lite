import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkoutSchema } from "../validators/workout";
import { CreateWorkoutInput } from "../validators/workout";
import { createWorkout } from "../api/workouts";
import { toast } from "react-hot-toast";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { LucidePlus, LucideTrash2 } from "lucide-react";

export default function WorkoutForm() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWorkoutInput>({
    resolver: zodResolver(createWorkoutSchema),
    defaultValues: {
      date: new Date(),
      exercise: "",
      sets: [{ reps: 10, weight: 0 }],
    },
  });

  // dynamic sets
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sets",
  });

  const onSubmit = async (data: CreateWorkoutInput) => {
    await createWorkout(data);
    toast.success("Workout logged!");
    reset();         // clears the form
  };

  return (
    <Card className="w-full max-w-xl mx-auto mt-6">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Log a Workout</h2>

        {/* Exercise name */}
        <input
          {...register("exercise")}
          placeholder="Exercise (e.g., Bench Press)"
          className="input input-bordered w-full"
        />
        {errors.exercise && (
          <p className="text-sm text-red-500">{errors.exercise.message}</p>
        )}

        {/* Sets */}
        <div className="space-y-2">
          {fields.map((field, idx) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                type="number"
                {...register(`sets.${idx}.reps`, { valueAsNumber: true })}
                placeholder="Reps"
                className="input w-24"
              />
              <input
                type="number"
                {...register(`sets.${idx}.weight`, { valueAsNumber: true })}
                placeholder="Weight"
                className="input w-24"
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(idx)}
              >
                <LucideTrash2 size={18} />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ reps: 10, weight: 0 })}
            className="flex items-center gap-1"
          >
            <LucidePlus size={16} /> Add set
          </Button>
        </div>

        <Button onClick={handleSubmit(onSubmit)} className="w-full mt-2">
          Save
        </Button>
      </CardContent>
    </Card>
  );
}
