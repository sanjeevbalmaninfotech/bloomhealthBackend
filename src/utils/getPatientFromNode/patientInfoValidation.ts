import { handleServiceResponse } from "@/common/utils/httpHandlers";

function normalizeMobile(mobile?: string | null): string {
  return String(mobile ?? "").trim();
}

function normalizeCountryCode(code?: string | null): string {
  return String(code ?? "")
    .replace("+", "")
    .trim();
}

export const validateContact = async (
  dbMobileNumber: string,
  dBCountryCode: string,
  patientContact: { mobileNumber: string | null; countryCode: string | null },
  res: any,
) => {
  const normalizedMobile = normalizeMobile(dbMobileNumber);
  const normalizedPatientMobile = normalizeMobile(patientContact.mobileNumber);

  if (normalizedMobile !== normalizedPatientMobile) {
    const failure = (await import("@/common/models/serviceResponse")).myResponse.failure(
      "Provided mobileNumber does not match our records",
      null,
      400,
    );
    return handleServiceResponse(failure, res);
  }

  const normalizedCountryCode = normalizeCountryCode(dBCountryCode);
  const normalizedPatientCountryCode = normalizeCountryCode(patientContact.countryCode);

  if (normalizedCountryCode !== normalizedPatientCountryCode) {
    const failure = (await import("@/common/models/serviceResponse")).myResponse.failure(
      "Provided countryCode does not match our records",
      null,
      400,
    );
    return handleServiceResponse(failure, res);
  }

  return true; // ✅ valid
};
