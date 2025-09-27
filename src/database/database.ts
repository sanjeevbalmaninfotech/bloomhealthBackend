const database = {
  connected: false,
  connect: async () => ({ connected: false }),
  close: async () => {},
  query: async () => {
    throw new Error("SQL functionality removed: use Cosmos DB repositories instead.");
  },
};

export { database };
