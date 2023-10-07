export interface FetchUserData {
  _id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
}

export interface FindUserData {
  email?: string;
  name?: string;
  contactPhone?: string;
}

export interface FetchUsersResult {
  count: number;
  result: FetchUserData[];
}

export interface AddUserData {
  email: string;
  password: string;
  name: string;
  contactPhone: string;
  role: string;
}
