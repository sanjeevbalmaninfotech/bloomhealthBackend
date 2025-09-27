import type { Request, RequestHandler, Response } from "express";

import { patientCosmosRepository } from "@/api/patient/patientCosmosRepository";
import { patientService } from "@/api/patient/patientService";
import { env } from "@/common/utils/envConfig";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { sendEmail } from "@/utils/email";
import { sendMessage } from "@/utils/sms";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class PatientController {
  public getPatients: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await patientService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getPatient: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await patientService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public register: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, password, phoneCountryCode, phoneNumber, city, state } = req.body as {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phoneCountryCode?: string;
        phoneNumber?: string;
        city?: string;
        state?: string;
      };

      // Check existing user by email
      const existing = await patientCosmosRepository.findByEmailAsync(email);
      if (existing) {
        const failure = (await import("@/common/models/serviceResponse")).ServiceResponse.failure(
          "Email already registered",
          null,
          400,
        );
        return handleServiceResponse(failure, res);
      }

      // If phone provided, ensure it's unique
      if (phoneCountryCode && phoneNumber) {
        const byPhone = await patientCosmosRepository.findByPhoneAsync(phoneCountryCode, phoneNumber);
        if (byPhone) {
          const failure = (await import("@/common/models/serviceResponse")).ServiceResponse.failure(
            "Phone number already registered",
            null,
            400,
          );
          return handleServiceResponse(failure, res);
        }
      }

      const hashed = await bcrypt.hash(password, 10);
      const toCreate = {
        firstName,
        lastName,
        email,
        password: hashed,
        phoneCountryCode: phoneCountryCode || undefined,
        phoneNumber: phoneNumber || undefined,
        city: city || undefined,
        state: state || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const created = await patientCosmosRepository.createAsync(toCreate);
      // strip password
      // @ts-ignore
      created.password = undefined;

      const success = (await import("@/common/models/serviceResponse")).ServiceResponse.success(
        "Patient registered",
        created,
      );
      return handleServiceResponse(success, res);
    } catch (ex) {
      const failure = (await import("@/common/models/serviceResponse")).ServiceResponse.failure(
        "Error registering patient",
        null,
        500,
      );
      return handleServiceResponse(failure, res);
    }
  };

  public login: RequestHandler = async (req: Request, res: Response) => {
    // older email/phone union login replaced by the multi-step flow
    const failure = (await import("@/common/models/serviceResponse")).ServiceResponse.failure(
      "Endpoint removed - use /start-login then /send-otp",
      null,
      410,
    );
    return handleServiceResponse(failure, res);
  };

  public loginWithPhone: RequestHandler = async (req: Request, res: Response) => {
    const failure = (await import("@/common/models/serviceResponse")).ServiceResponse.failure(
      "Endpoint removed - use /start-login then /send-otp",
      null,
      410,
    );
    return handleServiceResponse(failure, res);
  };

  // Step 1: start-login - return masked phone details for given user id
  public startLogin: RequestHandler = async (req: Request, res: Response) => {
    try {
      const body = req.body as { patientId?: string | number };
      const id = body.patientId;
      console.log("startLogin called with body:", id);
      const existing = await patientCosmosRepository.findByIdAsync(id as string | number);
      if (!existing) {
        const failure = (await import("@/common/models/serviceResponse")).ServiceResponse.failure(
          "Patient not found",
          null,
          404,
        );
        return handleServiceResponse(failure, res);
      }

      // mask phone number for privacy (show last 2-4 digits depending length)
      const cc = existing.phoneCountryCode || undefined;
      const num = existing.phoneNumber || undefined;
      let masked: string | undefined = undefined;
      if (num) {
        const visible = Math.min(4, Math.max(2, Math.floor(num.length / 2)));
        masked = num.slice(0, 1) + "*".repeat(Math.max(0, num.length - visible - 1)) + num.slice(num.length - visible);
      }

      const success = (await import("@/common/models/serviceResponse")).ServiceResponse.success("User found", {
        phoneCountryCode: cc,
        phoneNumber: masked,
      });
      return handleServiceResponse(success, res);
    } catch (ex) {
      const failure = (await import("@/common/models/serviceResponse")).ServiceResponse.failure(
        "Error during start-login",
        null,
        500,
      );
      return handleServiceResponse(failure, res);
    }
  };

  // Step 2: send-otp - generate and send otp for patientId
  public sendOtp: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { patientId } = req.body as { patientId: number };
      const existing = await patientCosmosRepository.findByIdAsync(patientId);
      if (!existing) {
        const failure = (await import("@/common/models/serviceResponse")).ServiceResponse.failure(
          "User not found",
          null,
          404,
        );
        return handleServiceResponse(failure, res);
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 5 * 60 * 1000);
      await patientCosmosRepository.updateOtpAsync(existing.id as any, otp, expiry);

      // send via SMS if phone present
      if (existing.phoneCountryCode && existing.phoneNumber) {
        const to = `${existing.phoneCountryCode}${existing.phoneNumber}`;
        const message = `Your login OTP is: ${otp}. It expires in 5 minutes.`;
        try {
          await sendMessage(to, message);
        } catch (smsErr) {
          console.error("SMS send failed", smsErr);
        }
      }

      // also send via email if present
      if (existing.email) {
        try {
          await sendEmail(existing.email, "Your OTP code", `Your login OTP is: ${otp}. It expires in 5 minutes.`);
        } catch (emailErr) {
          console.error("Email send failed", emailErr);
        }
      }

      const success = (await import("@/common/models/serviceResponse")).ServiceResponse.success("OTP sent", {
        message: "OTP sent",
      });
      return handleServiceResponse(success, res);
    } catch (ex) {
      const failure = (await import("@/common/models/serviceResponse")).ServiceResponse.failure(
        "Error sending OTP",
        null,
        500,
      );
      return handleServiceResponse(failure, res);
    }
  };

  // Resend OTP - same as sendOtp but kept separate for clarity
  public resendOtp: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { patientId } = req.body as { patientId: number };
      // Reuse sendOtp logic by delegating (cast to any to satisfy TS when invoking RequestHandler)
      await (this.sendOtp as any)(req, res);
      return;
    } catch (ex) {
      const failure = (await import("@/common/models/serviceResponse")).ServiceResponse.failure(
        "Error resending OTP",
        null,
        500,
      );
      return handleServiceResponse(failure, res);
    }
  };

  public verifyOtp: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { patientId, otp } = req.body as { patientId: number; otp: string };
      const existing = await patientCosmosRepository.findByIdAsync(patientId);
      if (!existing) {
        const failure = (await import("@/common/models/serviceResponse")).ServiceResponse.failure(
          "User not found",
          null,
          404,
        );
        return handleServiceResponse(failure, res);
      }

      // @ts-ignore
      if (!existing.otp || (existing.otp as string) !== otp) {
        const failure = (await import("@/common/models/serviceResponse")).ServiceResponse.failure(
          "Invalid OTP",
          null,
          400,
        );
        return handleServiceResponse(failure, res);
      }

      // @ts-ignore
      const expiry = existing.otpExpiry ? new Date(existing.otpExpiry) : null;
      if (!expiry || expiry < new Date()) {
        const failure = (await import("@/common/models/serviceResponse")).ServiceResponse.failure(
          "OTP expired",
          null,
          400,
        );
        return handleServiceResponse(failure, res);
      }

      const token = jwt.sign(
        { sub: existing.id, phone: `${existing.phoneCountryCode || ""}${existing.phoneNumber || ""}` },
        env.JWT_SECRET,
        { expiresIn: "1h" },
      );
      const success = (await import("@/common/models/serviceResponse")).ServiceResponse.success("OTP verified", {
        token,
      });
      return handleServiceResponse(success, res);
    } catch (ex) {
      const failure = (await import("@/common/models/serviceResponse")).ServiceResponse.failure(
        "Error verifying OTP",
        null,
        500,
      );
      return handleServiceResponse(failure, res);
    }
  };
}

export const patientController = new PatientController();
