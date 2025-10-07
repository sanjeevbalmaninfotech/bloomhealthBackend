import dotenv from "dotenv";
import { bool, cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
  }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  LEGACY_TARGET_SERVER: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),

  COSMOS_ENDPOINT: str({ devDefault: testOnly("https://localhost:8081/") }),
  COSMOS_KEY: str({ devDefault: testOnly("C2y6yDjf5/R+ob0N8A7Cgv30VRGj==") }),
  COSMOS_DATABASE: str({ devDefault: testOnly("TestDatabase") }),
  COSMOS_CONTAINER: str({ devDefault: testOnly("Patients") }),
  JWT_SECRET_For_React_Frontend: str({ devDefault: testOnly("dev-secret") }),
  TWILIO_ACCOUNT_SID: str({ devDefault: testOnly("") }),
  TWILIO_AUTH_TOKEN: str({ devDefault: testOnly("") }),
  TWILIO_PHONE_NUMBER: str({ devDefault: testOnly("") }),

  MAIN_NODE_API_URL: str({ devDefault: testOnly("http://localhost:8080") }),
  NODE_TOKEN_GENERATION_ID: str({ devDefault: testOnly("A7#dL9!123") }),
  NODE_TOKEN_GENERATION_SECRET: str({ devDefault: testOnly("vP3@Z#qL8x") }),
});
