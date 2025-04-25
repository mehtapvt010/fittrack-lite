import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Meal } from "../api/meals";

const COLORS = ["#4ade80", "#60a5fa", "#f87171"];

export default function MacroChart({ meals }: { meals: Meal[] }) {
  const data = [
    { name: "Protein", value: meals.reduce((sum, m) => sum + m.protein, 0) },
    { name: "Carbs", value: meals.reduce((sum, m) => sum + m.carbs, 0) },
    { name: "Fat", value: meals.reduce((sum, m) => sum + m.fat, 0) },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <h3 className="font-bold mb-2">🧪 Macronutrient Breakdown</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={70}
            label
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
