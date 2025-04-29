-- CreateTable
CREATE TABLE "MacroMismatch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "calorieDelta" INTEGER NOT NULL,
    "proteinDelta" INTEGER NOT NULL,
    "carbsDelta" INTEGER NOT NULL,
    "fatDelta" INTEGER NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "emailed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MacroMismatch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MacroMismatch" ADD CONSTRAINT "MacroMismatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
