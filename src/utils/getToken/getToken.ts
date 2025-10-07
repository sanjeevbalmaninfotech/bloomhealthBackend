import { env } from "@/common/utils/envConfig";
import axios from "axios";

const MAIN_NODE_API_URL = env.MAIN_NODE_API_URL;
const TOKEN_ID = env.NODE_TOKEN_GENERATION_ID;
const TOKEN_SECRET = env.NODE_TOKEN_GENERATION_SECRET;

export const getTokenFromNodeBackend = async (): Promise<string> => {
  try {
    const payload = {
      tokenId: TOKEN_ID,
      tokenKey: TOKEN_SECRET,
    };

    const response = await axios.post(`${MAIN_NODE_API_URL}/bloomPatient/generateToken`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response?.data?.token) {
      return response?.data?.token;
    }

    return "";
  } catch (error) {
    console.error("Error calling token API:", error);
    // Return empty string instead of throwing error
    return "";
  }
};
