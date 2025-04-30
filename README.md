# FitTrack Lite + Macro Sync 🏋️🥗

Your all-in-one fitness & nutrition dashboard – track workouts, sync meals, and stay on target with weekly goals. Built with a modern stack and production-grade AWS infrastructure.

Deployment URLs

Frontend: https://fittrack-lite.vercel.app

Backend: https://fittrack-lite-api.onrender.com

## 🌟 Features

- 🏋️ Workout logging with real-time volume tracking
- 🧠 Redis caching + live feedback streams
- 📈 Weekly goals, streaks, and progress indicators
- 🥗 CSV-based meal syncing (MyFitnessPal-style)
- 🧠 Automatic macro mismatch detection
- 📬 Email + UI alerts for calorie/protein issues
- 📊 AWS Batch weekly adherence reports
- 🚀 Fully deployed backend (Render) & frontend (Vercel)

## 🖼 Demo

Demo login: test1@email.com / password: pass1234

![FitTrack Lite Demo](./assets/demo.gif)

> Login with test user: `demo@fittrack.com` / password: `fittrack123`

## 🧱 Architecture

![Architecture Diagram](./assets/architecture.png)

## 🛠 Tech Stack

**Frontend:** React, TypeScript, TailwindCSS, Vite  
**Backend:** Node.js, Express, Prisma, PostgreSQL  
**Infra:** AWS CDK, Lambda, S3, EventBridge, CloudWatch, Redis (Upstash)  
**Deployment:** Vercel (Frontend), Render (Backend), Docker

## 📂 Project Structure

```bash
/fittrack-lite
│
├── backend/           # Node.js + Prisma API
├── sdk/               # NPM-ready JS SDK for embedding
├── widget-public/     # Public embeddable widget
├── frontend/          # React + Tailwind dashboard
├── lambda/            # AWS Lambda functions
└── infra/             # AWS CDK deployment stack

```

### 📦 Install and Run

# Clone the repo
git clone https://github.com/your-username/fittrack-lite.git
cd fittrack-lite

# Start backend
cd backend
npm install
npx prisma migrate dev
npm run dev

# Start frontend
cd ../frontend
npm install
npm run dev

### 🔐 .env Example
In the root of both backend/ and frontend/, mention what environment variables are required. For example:

# backend/.env

DATABASE_URL=postgresql://user:password@localhost:5432/fittrack
REDIS_URL=redis://default:xxxxxx@your-upstash-url:port
JWT_SECRET=your-jwt-secret
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=your-bucket-name
SES_EMAIL_FROM=noreply@fittrack.com


# frontend/.env

VITE_API_URL=https://your-render-api.onrender.com

### 🧪 Seeding the Database

cd backend
npx prisma db seed
