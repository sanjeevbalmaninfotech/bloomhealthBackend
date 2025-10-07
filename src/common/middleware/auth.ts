import { myResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

export interface JwtPayload {
  sub: string | number;
  iat?: number;
  exp?: number;
}

export const jwtAuth = (options?: {
  maxAgeSeconds?: number;
}): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = (req.headers.authorization as string) || (req.headers.Authorization as string | undefined);

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const resp = myResponse.failure("Missing or invalid authorization header", null, 401);
        return handleServiceResponse(resp, res);
      }

      const token = authHeader.split(" ")[1];
      const secret = String(env.JWT_SECRET_For_React_Frontend);
      console.log(token, "Using JWT secret:", secret);
      let decoded: JwtPayload;

      try {
        decoded = jwt.verify(token, secret) as JwtPayload;
      } catch (err) {
        if (err instanceof TokenExpiredError) {
          const resp = myResponse.failure("Token expired", null, 401);
          return handleServiceResponse(resp, res);
        } else if (err instanceof JsonWebTokenError) {
          const resp = myResponse.failure("Invalid token", null, 401);
          return handleServiceResponse(resp, res);
        } else {
          console.error("JWT verification error:", err);
          const resp = myResponse.failure("Token verification failed", null, 401);
          return handleServiceResponse(resp, res);
        }
      }

      // Optional: Validate max token age (not just exp)
      //   if (options?.maxAgeSeconds && decoded?.iat) {
      //     const age = Math.floor(Date.now() / 1000) - decoded.iat;
      //     console.log("Token age (seconds):", age, " ---- ", decoded.iat);
      //     if (age > options.maxAgeSeconds) {
      //       const resp = myResponse.failure("Token too old", null, 401);
      //       return handleServiceResponse(resp, res);
      //     }
      //   }

      // Attach user ID to request
      (req as any).user = { id: decoded.sub };
      next();
    } catch (ex) {
      console.error("JWT auth middleware error:", ex);
      const resp = myResponse.failure("Authentication error", null, 401);
      return handleServiceResponse(resp, res);
    }
  };
};

export const signToken = (payload: { sub: string | number }, options?: { expiresIn?: string | number }): string => {
  const safePayload = { sub: String(payload.sub) };
  const secret: jwt.Secret = String(env.JWT_SECRET_For_React_Frontend);

  const signOptions: jwt.SignOptions = {};
  if (options?.expiresIn !== undefined) {
    signOptions.expiresIn = options.expiresIn as any;
  } else {
    signOptions.expiresIn = "7d";
  }

  return jwt.sign(safePayload, secret, signOptions);
};
