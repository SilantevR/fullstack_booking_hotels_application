import { SignUpData } from "../sign-up/types";
export interface Lists {
  label: string;
  text?: string;
  name?: string;
  handleChange?: (e: any) => void;
  defaultVal?: string;
}
export interface UserInformation extends SignUpData {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
}

export interface UserData {
  data: undefined | UserInformation;
  status: string;
  error: string;
}
