import { Role } from "../enums/role.enum";

export interface User {
  id: string;
  email: string;
  name: string;
  contactPhone?: string;
  password: string;
  role: Role;
}

export interface ActiveUserData {
  sub: User['id'];
  email: User['email'];
  role: User['role'];
}

export interface SearchUserParams {
  limit: number;
  offset: number;
  email: string;
  name: string;
  contactPhone: string;
}
export interface IUserService {
  create(data: Partial<User>): Promise<User>;
  findById(id: User['id']): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(params: SearchUserParams): Promise<User[]>;
}
