import { env } from "@/common/utils/envConfig";
import { CosmosClient as AzureCosmosClient, type Container } from "@azure/cosmos";

const client = new AzureCosmosClient({ endpoint: env.COSMOS_ENDPOINT, key: env.COSMOS_KEY });

export async function getDatabase() {
  const { database } = await client.databases.createIfNotExists({ id: env.COSMOS_DATABASE });
  return database;
}

export async function getContainer(containerId: string = env.COSMOS_CONTAINER): Promise<Container> {
  const db = await getDatabase();
  const { container } = await db.containers.createIfNotExists({ id: containerId });
  return container;
}

export { AzureCosmosClient };
