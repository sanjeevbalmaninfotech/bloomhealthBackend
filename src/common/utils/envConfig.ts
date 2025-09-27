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
  // DB_SERVER is optional because many deployments use Cosmos DB only.
  DB_SERVER: str({ devDefault: testOnly("") }),
  DB_USER: str({ devDefault: testOnly("") }),
  DB_PASS: str({ devDefault: testOnly("") }),
  DB_NAME: str({ devDefault: testOnly("") }),
  DB_PORT: num({ devDefault: testOnly(1433) }),

  COSMOS_ENDPOINT: str({ devDefault: testOnly("https://localhost:8081/") }),
  COSMOS_KEY: str({ devDefault: testOnly("C2y6yDjf5/R+ob0N8A7Cgv30VRGj==") }),
  COSMOS_DATABASE: str({ devDefault: testOnly("TestDatabase") }),
  COSMOS_CONTAINER: str({ devDefault: testOnly("Patients") }),
  JWT_SECRET: str({ devDefault: testOnly("dev-secret") }),
  TWILIO_ACCOUNT_SID: str({ devDefault: testOnly("") }),
  TWILIO_AUTH_TOKEN: str({ devDefault: testOnly("") }),
  TWILIO_PHONE_NUMBER: str({ devDefault: testOnly("") }),
});
