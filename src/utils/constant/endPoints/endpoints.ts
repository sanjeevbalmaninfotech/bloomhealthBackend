import { BookAppointmentSchema } from "@/api/doctor/doctorModel";

export const Endpoints = {
  getPatientsUrl: "/patient/getPatients",

  registerUrl: "/patient/register",
  loginUrl: "/patient/loginId",
  sendOtpUrl: "/patient/sendOtp",
  resendOtpUrl: "/patient/resendOtp",
  verifyOtpUrl: "/patient/verifyOtp",
  getAllDoctorsUrl: "/bloomPatient/getAllDoctors",
  getSingleDoctorUrl: "/bloomPatient/doctors/",
  getDoctorByDepartmentIdUrl: "/bloomPatient/getDoctorByDepartmentId/",
  bookAppointmentUrl: "/patient/appointments",
  getSingleDepartmentUrl: "/bloomPatient/departments/",
};
