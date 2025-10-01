import { myResponseSchema } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";
import type { z } from "zod";

export function createApiResponse(schema: z.ZodTypeAny, description: string, statusCode = StatusCodes.OK) {
  return {
    [statusCode]: {
      description,
      content: {
        "application/json": {
          schema: myResponseSchema(schema),
        },
      },
    },
  };
}
