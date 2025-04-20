/*
  Warnings:

  - You are about to drop the column `date` on the `Meal` table. All the data in the column will be lost.
  - You are about to drop the column `kcal` on the `Meal` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `volume` on the `Workout` table. All the data in the column will be lost.
  - Added the required column `calories` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carbs` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fat` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `caloriesBurned` to the `Workout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Workout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meal" DROP COLUMN "date",
DROP COLUMN "kcal",
ADD COLUMN     "calories" INTEGER NOT NULL,
ADD COLUMN     "carbs" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fat" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "date",
DROP COLUMN "volume",
ADD COLUMN     "caloriesBurned" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
