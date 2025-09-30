import NodeCache from "node-cache";

// 5 minutes TTL (300 seconds)
const otpCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

export const setOtpForPatient = (patientId: string | number, otp: string, ttlSeconds?: number) => {
  const key = `patient_otp_${patientId}`;
  // If provided ttlSeconds use NodeCache ttl option per-set
  if (ttlSeconds) {
    otpCache.set(key, otp, ttlSeconds);
  } else {
    otpCache.set(key, otp);
  }
};

export const getOtpForPatient = (patientId: string | number) => {
  const key = `patient_otp_${patientId}`;
  const val = otpCache.get<string>(key);
  return val || null;
};

export const deleteOtpForPatient = (patientId: string | number) => {
  const key = `patient_otp_${patientId}`;
  otpCache.del(key);
};

export default otpCache;
