import { Options } from "./types";
const BASE_URL = "http://localhost:5000/api";
const baseOptions: Options = {
  credentials: "include",
  headers: {
    "content-type": "application/json",
  },
};

export { BASE_URL, baseOptions };
