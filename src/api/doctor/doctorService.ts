import { myResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";

import { env } from "@/common/utils/envConfig";
import { Endpoints } from "@/utils/constant/endPoints/endpoints";
import axios from "axios";
import type { Doctor } from "./doctorModel";

const MAIN_NODE_API_URL = env.MAIN_NODE_API_URL;
export class DoctorService {
  async getAllDoctors(): Promise<myResponse<Doctor[] | null>> {
    try {
      const response = await axios.get(`${MAIN_NODE_API_URL}${Endpoints.getAllDoctorsUrl}`);
      if (!response || response.status !== 200) {
        return myResponse.failure("Error finding doctors", null, 500);
      }
      return myResponse.success("Doctors found", response.data);
    } catch (ex) {
      return myResponse.failure("Error finding doctors", null, 500);
    }
  }

  async getDoctorById(id: string | number): Promise<myResponse<Doctor | null>> {
    try {
      const response = await axios.get(`${MAIN_NODE_API_URL}${Endpoints.getSingleDoctorUrl}${id}`);
      if (!response || response.status !== 200) {
        return myResponse.failure("Error finding doctor", null, 500);
      }
      return myResponse.success("Doctor found", response.data);
    } catch (ex) {
      return myResponse.failure("Error finding doctor", null, 500);
    }
  }

  async getDepartmentsById(id: string | number): Promise<myResponse<Doctor | null>> {
    try {
      const response = await axios.get(`${MAIN_NODE_API_URL}${Endpoints.getSingleDepartmentUrl}${id}`);
      if (!response || response.status !== 200) {
        return myResponse.failure("Error finding department", null, 500);
      }
      return myResponse.success("Department found", response.data);
    } catch (ex) {
      return myResponse.failure("Error finding department", null, 500);
    }
  }
}

export const doctorService = new DoctorService();
