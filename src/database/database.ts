import { env } from "@/common/utils/envConfig";

const sql = require("mssql");

const config = {
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  server: env.DB_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: false,
  },
};

const dbConnect = new sql.connect(config, (err) => {
  if (err) {
    console.log("Error while connecting database: ", err);
  } else {
    console.log("connected to database: ", config.server);
  }
});

export const database = dbConnect;
