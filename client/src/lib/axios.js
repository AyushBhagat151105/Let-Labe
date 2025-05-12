import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.SERVER_BASE_URL,
  withCredentials: true,
});
