import { Options } from "./types";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";
export const PUBLIC_URL =
  import.meta.env.VITE_PUBLIC_URL || "http://localhost:5000";
const baseOptions: Options = {
  credentials: "include",
  headers: {
    "content-type": "application/json",
  },
};

export { BASE_URL, baseOptions };
