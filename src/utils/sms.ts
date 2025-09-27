import { env } from "@/common/utils/envConfig";
import twilio from "twilio";

const accountSid = env.TWILIO_ACCOUNT_SID as string;
const authToken = env.TWILIO_AUTH_TOKEN as string;
const fromNumber = env.TWILIO_PHONE_NUMBER as string;

const client = twilio(accountSid, authToken);

export async function sendMessage(to: string, body: string): Promise<void> {
  try {
    const message = await client.messages.create({
      body,
      from: fromNumber,
      to,
    });
  } catch (error) {
    console.error("❌ Failed to send SMS:", error);
    throw error;
  }
}
