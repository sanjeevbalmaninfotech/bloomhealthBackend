import type { User } from "@/api/user/userModel";
import { database } from "../../database/database";

export class UserRepository {
  async findAllAsync(): Promise<User[]> {
    if (!database.connected) {
      const db = await database.connect();
    }

    const result = await database.query("SELECT TOP (5) * FROM BloomEMR_OS.dbo.ACC_Bill_LedgerMapping");
    await database.close();
    return result.recordset;
  }

  async findByIdAsync(id: number): Promise<User | null> {
    return null;
  }
}
