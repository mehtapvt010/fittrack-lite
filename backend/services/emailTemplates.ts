// backend/src/services/emailTemplates.ts

import { User } from '@prisma/client';

export interface MismatchData {
  calorieDelta: number;
  proteinDelta: number;
  carbsDelta: number;
  fatDelta: number;
}

/**
 * Returns an HTML snippet summarizing the macro mismatch for emailing.
 */
export function renderEmailTemplate(
  user: Pick<User, 'email'>,
  data: MismatchData,
): string {
  const { calorieDelta, proteinDelta, carbsDelta, fatDelta } = data;

  // helper to format positive/negative deltas
  const fmt = (n: number) =>
    `${n > 0 ? '+' : ''}${n} ${n > 0 ? 'over' : 'under'}`;

  return `
    <html>
      <body style="font-family:Arial,sans-serif;line-height:1.5;color:#333;">
        <h2>Hi ${user.email.split('@')[0]},</h2>
        <p>We’ve detected a mismatch between your meals and macro goals for today:</p>
        <ul>
          <li><strong>Calories:</strong> ${fmt(calorieDelta)}</li>
          <li><strong>Protein:</strong> ${fmt(proteinDelta)}</li>
          <li><strong>Carbs:</strong> ${fmt(carbsDelta)}</li>
          <li><strong>Fat:</strong> ${fmt(fatDelta)}</li>
        </ul>
        <p>
          To review details or resolve this, please head over to your
          <a href="https://your-frontend-domain.com/dashboard?tab=meals">
            FitTrack Lite Dashboard
          </a>.
        </p>
        <p>Happy tracking!<br/>— The FitTrack Lite Team</p>
      </body>
    </html>
  `;
}
