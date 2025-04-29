import { PrismaClient } from '@prisma/client';
import { sendMismatchEmail } from '../../backend/services/emailService';
import { renderEmailTemplate, MismatchData } from '../../backend/services/emailTemplates';

const prisma = new PrismaClient();

export const handler = async (): Promise<void> => {
  // 1. fetch users & meals since last run
  const users = await prisma.user.findMany();
  for (const user of users) {
    const mismatchData = await calculateMismatchForUser(user.id);
    if (mismatchData.deltaExceeded) {
      // write to MacroMismatch table
      await prisma.macroMismatch.create({
        data: {
          userId: user.id,
          date: new Date(),
          calorieDelta: mismatchData.calorieDelta,
          proteinDelta: mismatchData.proteinDelta,
          carbsDelta: mismatchData.carbsDelta,
          fatDelta: mismatchData.fatDelta,
        },
      });

      // send SES e-mail (skip in local)
      if (!process.env.IS_LOCAL) {
        const html = renderEmailTemplate({ email: user.email }, {
          calorieDelta: mismatchData.calorieDelta,
          proteinDelta: mismatchData.proteinDelta,
          carbsDelta: mismatchData.carbsDelta,
          fatDelta: mismatchData.fatDelta,
        });
        
        await sendMismatchEmail(user.email, html);
      }
    }
  }
};

// helper (you can extract to its own file)
async function calculateMismatchForUser(userId: string) {
  // … your existing Day 8 logic to sum meals/workouts & compare targets …
  return {
    deltaExceeded: true,      // or false
    calorieDelta: 1200,
    proteinDelta: -50,
    carbsDelta: 200,
    fatDelta: 30,
  };
}
