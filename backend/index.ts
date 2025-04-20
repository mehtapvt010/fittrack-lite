import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import workoutRoutes from './routes/workouts';
import userRoutes from './routes/users';

dotenv.config();


export const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
