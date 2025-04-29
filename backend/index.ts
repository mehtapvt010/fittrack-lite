import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import workoutRoutes from './routes/workouts';
import userRoutes from './routes/users';
import dashboardRoutes from './routes/dashboard';
import uploadRoutes from './routes/uploads';
import mealRoutes from './routes/meals';
import mismatchRoutes from './routes/mismatches';

dotenv.config();


export const app = express();

const allowedOrigins = [
  'http://localhost:5173',     // for local dev
  'http://localhost:4173',     // for vite preview
  "https://fittrack-lite.vercel.app",  // for production (Vercel URL)
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);
app.use("/api/metrics", dashboardRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/mismatches", mismatchRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
