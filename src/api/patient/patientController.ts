import type { Request, RequestHandler, Response } from "express";

import { patientCosmosRepository } from "@/api/patient/patientCosmosRepository";
import { patientService } from "@/api/patient/patientService";
import { env } from "@/common/utils/envConfig";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { sendEmail } from "@/utils/email";
import { sendMessage } from "@/utils/sms";
import bcrypt from "bcryptjs";

import { deleteOtpForPatient, getOtpForPatient, setOtpForPatient } from "@/api/patient/otpCache";
import { myResponse, myResponseSchema } from "@/common/models/serviceResponse";
import axios from "axios";

import { getPatientContact } from "@/utils/getPatientFromNode/getPatientFromNode";
import { validateContact } from "@/utils/getPatientFromNode/patientInfoValidation";

const MAIN_NODE_API_URL = env.MAIN_NODE_API_URL;

class PatientController {
  public getPatients: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await patientService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getPatient: RequestHandler = async (req: Request, res: Response) => {
    console.log("getPatient called with id:", req.params.id);
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await patientService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public register: RequestHandler = async (req: Request, res: Response) => {
    try {
      const serviceResponse = await patientService.register(req.body);
      return handleServiceResponse(serviceResponse, res);
    } catch (ex) {
      console.error("Error in register:", ex);
      const failure = myResponse.failure("Error registering patient", null, 500);
      return handleServiceResponse(failure, res);
    }
  };

  // Step 1: start-login - return masked phone details for given user id
  public matchLoginId: RequestHandler = async (req: Request, res: Response) => {
    try {
      console.log("matchLoginId called with body:", req.body);
      const body = req.body as { patientId?: string | number };
      const patientId = body.patientId;
      if (!patientId) {
        const failure = myResponse.failure("patientId is required", null, 400);
        return handleServiceResponse(failure, res);
      }

      const response = await axios.get(`${MAIN_NODE_API_URL}/patient/${patientId}`);

      const patientMobileNumber = response?.data?.data?.Results?.PhoneNumber;
      const patientCountryCode = response?.data?.data?.Results?.PhoneCode;

      //  const existing = await patientCosmosRepository.findByIdAsync(id as string | number);
      if (!patientMobileNumber && !patientCountryCode) {
        const failure = myResponse.failure("Patient not found", null, 404);
        return handleServiceResponse(failure, res);
      }

      let masked: string | undefined = undefined;
      const visible = Math.min(4, Math.max(2, Math.floor(patientMobileNumber.length / 2)));
      masked =
        patientMobileNumber.slice(0, 1) +
        "*".repeat(Math.max(0, patientMobileNumber.length - visible - 1)) +
        patientMobileNumber.slice(patientMobileNumber.length - visible);

      const success = myResponse.success("Patient found", {
        patientCountryCode,
        masked,
      });
      return handleServiceResponse(success, res);
    } catch (ex) {
      console.error("Error in matchLoginId:", ex);
      const failure = myResponse.failure("Error during start-login", ex, 500);
      return handleServiceResponse(failure, res);
    }
  };

  public sendOtp: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { patientId, mobileNumber, countryCode } = req.body as {
        patientId: string;
        mobileNumber?: string;
        countryCode?: string;
      };

      if (!patientId || !mobileNumber || !countryCode) {
        const failure = myResponse.failure("PatientId, mobileNumber and countryCode are required", null, 404);
        return handleServiceResponse(failure, res);
      }

      const patientContact = await getPatientContact(patientId);

      if (!patientContact.mobileNumber || !patientContact.countryCode) {
        const failure = myResponse.failure("Patient contact details not found", null, 404);
        return handleServiceResponse(failure, res);
      }
      const validationResult = await validateContact(mobileNumber, countryCode, patientContact, res);

      if (validationResult !== true) {
        return;
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 5 * 60 * 1000);

      setOtpForPatient(patientId, otp, 300);

      const response = await axios.post(`${MAIN_NODE_API_URL}/patient/sendSmsEmailLoginOtp`, {
        patientName: patientContact.patientName,
        email: patientContact.email,
        countryCode,
        mobileNumber,
        otp,
      });

      const success = myResponse.success("OTP sent", {
        message: "OTP sent",
        otp: process.env.NODE_ENV === "production" ? undefined : otp,
        expiry,
      });
      return handleServiceResponse(success, res);
    } catch (ex) {
      const failure = myResponse.failure("Error sending OTP", ex, 400);
      return handleServiceResponse(failure, res);
    }
  };

  public verifyOtp: RequestHandler = async (req: Request, res: Response) => {
    try {
      // support either { patientId, otp } or { phoneCountryCode, phoneNumber, otp }
      const body = req.body as any;
      let patientId: string | number | undefined = body.patientId;
      const otp: string = body.otp;

      // If phone fields provided, resolve to patientId via repository
      if (!patientId && body.phoneCountryCode && body.phoneNumber) {
        const byPhone = await patientCosmosRepository.findByPhoneAsync(body.phoneCountryCode, body.phoneNumber);
        if (!byPhone) {
          const failure = myResponse.failure("Patient contact details not found", null, 404);
          return handleServiceResponse(failure, res);
        }
        patientId = (byPhone.id as any) || (byPhone.id as unknown as string);
      }

      if (!patientId) {
        const failure = myResponse.failure("Patient contact details not found", null, 404);
        return handleServiceResponse(failure, res);
      }

      const cachedOtp = getOtpForPatient(patientId as string | number);
      if (!cachedOtp) {
        const failure = myResponse.failure("OTP expired or not found", null, 400);
        return handleServiceResponse(failure, res);
      }

      if (cachedOtp !== otp) {
        const failure = myResponse.failure("Invalid OTP", null, 400);
        return handleServiceResponse(failure, res);
      }

      // OTP is valid - remove it from cache to prevent replay
      deleteOtpForPatient(patientId);

      const success = myResponse.success("OTP verified", {
        OTPVerified: true,
      });
      return handleServiceResponse(success, res);
    } catch (ex) {
      const failure = myResponse.failure("Error verifying OTP", null, 500);
      return handleServiceResponse(failure, res);
    }
  };
}

export const patientController = new PatientController();
