import { env } from "@/common/utils/envConfig";
import axios from "axios";
import { getTokenFromNodeBackend } from "../getToken/getToken";

const MAIN_NODE_API_URL = env.MAIN_NODE_API_URL;
export async function getPatientContact(patientId: string): Promise<{
  mobileNumber: string | null;
  countryCode: string | null;
  patientName: string | null;
  email: string | null;
}> {
  try {
    const tokenResponse = await getTokenFromNodeBackend();
    const response = await axios.get(`${MAIN_NODE_API_URL}/patient/${patientId}`, {
      headers: {
        Authorization: `Bearer ${tokenResponse}`,
      },
    });
    const results = response?.data?.data?.Results;
    const patientMobileNumber = results?.PhoneNumber ?? null;
    const patientCountryCode = results?.PhoneCode ?? null;
    const firstName = results?.FirstName ?? null;
    const lastName = results?.LastName ?? null;
    const email = results?.Email ?? null;

    // Combine first and last name
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim() || null;

    return {
      mobileNumber: patientMobileNumber ? String(patientMobileNumber).trim() : null,
      countryCode: patientCountryCode ? String(patientCountryCode).replace("+", "").trim() : null,
      patientName: fullName,
      email: email ? String(email).trim() : null,
    };
  } catch (error) {
    console.error("Error fetching patient contact:", error);
    return {
      mobileNumber: null,
      countryCode: null,
      patientName: null,
      email: null,
    };
  }
}
