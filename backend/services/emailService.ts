import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: process.env.SES_REGION });

export async function sendMismatchEmail(
  to: string,
  summaryHtml: string,
): Promise<void> {
  const params = {
    Destination: { ToAddresses: [to] },
    Source: process.env.SES_FROM_EMAIL!,
    Message: {
      Subject: { Data: '⚠️ FitTrack Lite – Macro mismatch detected' },
      Body: {
        Html: { Data: summaryHtml },
        Text: { Data: 'Macro goal mismatch – open your dashboard for details.' },
      },
    },
  };

  await ses.send(new SendEmailCommand(params));
}
