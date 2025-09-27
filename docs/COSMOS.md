# Cosmos DB Integration

This project includes a small Cosmos DB client wrapper and a sample repository for `Patient` data.

Files added:

- `src/database/cosmosClient.ts` - wraps `@azure/cosmos` and exposes `getContainer()` helper.
- `src/api/patient/patientCosmosRepository.ts` - example repository using the Cosmos container.

Environment variables (add these to `.env`):

- `COSMOS_ENDPOINT` - Cosmos DB endpoint (e.g. https://<your-account>.documents.azure.com:443/)
- `COSMOS_KEY` - Primary key for the Cosmos account
- `COSMOS_DATABASE` - Database id (default `TestDatabase`)
- `COSMOS_CONTAINER` - Container id (default `Patients`)

How to use:

1. Install dependencies:

```powershell
npm install
```

2. Start the app (dev):

```powershell
npm run dev
```

3. The `PatientCosmosRepository` is an example. You can use it directly in services or adapt existing repositories to Cosmos.

Notes:

- The code uses `createIfNotExists` to create database/container when missing — this is convenient for local dev but you may want to remove it for production.
- Update the query and partition key usage to match your data model for better performance.

