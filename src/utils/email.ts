export async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  // Placeholder: log the email. Replace with real email provider (SendGrid, SES, etc.)
  console.log(`Sending email to ${to}: ${subject}\n${body}`);
}
