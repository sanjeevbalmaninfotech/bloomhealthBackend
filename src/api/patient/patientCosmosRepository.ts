import type { Patient } from "@/api/patient/patientModel";
import { getContainer } from "@/database/cosmosClient";

export class PatientCosmosRepository {
  async findAllAsync(): Promise<Patient[]> {
    const container = await getContainer();
    const querySpec = { query: "SELECT TOP 50 * FROM c" };
    const { resources } = await container.items.query<Patient>(querySpec).fetchAll();
    return resources;
  }

  // Accept string or number IDs since Cosmos items may store id as string
  async findByIdAsync(id: string | number): Promise<Patient | null> {
    const container = await getContainer();
    const { resources } = await container.items
      .query<Patient>({ query: "SELECT * FROM c WHERE c.id = @id", parameters: [{ name: "@id", value: id }] })
      .fetchAll();
    return resources && resources.length > 0 ? resources[0] : null;
  }

  async findByEmailAsync(email: string): Promise<Patient | null> {
    const container = await getContainer();
    const { resources } = await container.items
      .query<Patient>({
        query: "SELECT * FROM c WHERE c.email = @email",
        parameters: [{ name: "@email", value: email }],
      })
      .fetchAll();
    return resources && resources.length > 0 ? resources[0] : null;
  }

  async createAsync(patient: Partial<Patient>): Promise<Patient> {
    const container = await getContainer();
    const { resource } = await container.items.create(patient as any);
    return resource as Patient;
  }

  async findByPhoneAsync(phoneCountryCode: string, phoneNumber: string): Promise<Patient | null> {
    const container = await getContainer();
    const { resources } = await container.items
      .query<Patient>({
        query: "SELECT * FROM c WHERE c.phoneCountryCode = @cc AND c.phoneNumber = @num",
        parameters: [
          { name: "@cc", value: phoneCountryCode },
          { name: "@num", value: phoneNumber },
        ],
      })
      .fetchAll();
    return resources && resources.length > 0 ? resources[0] : null;
  }

  async updateOtpAsync(id: string | number, otp: string, expiry: Date): Promise<void> {
    const container = await getContainer();
    // Read the item first to get _rid or partition key if needed
    const { resources } = await container.items
      .query({ query: "SELECT * FROM c WHERE c.id = @id", parameters: [{ name: "@id", value: id }] })
      .fetchAll();
    const item = resources && resources.length > 0 ? resources[0] : null;
    if (!item) return;
    item.otp = otp;
    item.otpExpiry = expiry;
    // Upsert the updated item
    await container.items.upsert(item as any);
  }
}

export const patientCosmosRepository = new PatientCosmosRepository();
