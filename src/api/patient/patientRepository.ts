// SQL-based PatientRepository was removed in favor of Cosmos DB.
// Keep a runtime guard here if any legacy code still imports it.
export class PatientRepository {
  constructor() {
    throw new Error("PatientRepository (SQL) has been removed. Use patientCosmosRepository instead.");
  }
}
