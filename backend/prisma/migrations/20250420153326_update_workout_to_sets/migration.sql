/*
  Warnings:

  - You are about to drop the column `caloriesBurned` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Workout` table. All the data in the column will be lost.
  - Added the required column `exercise` to the `Workout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sets` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "caloriesBurned",
DROP COLUMN "duration",
DROP COLUMN "name",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "exercise" TEXT NOT NULL,
ADD COLUMN     "sets" JSONB NOT NULL;
