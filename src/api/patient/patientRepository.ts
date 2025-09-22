import type { Patient } from "@/api/patient/patientModel";
import { database } from "@/database/database";

export class PatientRepository {
  async findAllAsync(): Promise<Patient[]> {
    if (!database.connected) {
      const db = await database.connect();
    }

    // Placeholder query - update to actual patient table
    const result = await database.query("SELECT TOP (5) * FROM BloomEMR_OS.dbo.Patients");
    await database.close();
    return result.recordset;
  }

  async findByIdAsync(id: number): Promise<Patient | null> {
    return null;
  }
}
