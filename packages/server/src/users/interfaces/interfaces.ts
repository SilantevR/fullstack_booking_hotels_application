import { Role } from '../../auth/enums/role.enum';
import mongoose = require('mongoose');
import Types = mongoose.Types;
import ObjectId = Types.ObjectId;

export interface User {
  id?: ObjectId;
  email: string;
  name: string;
  contactPhone?: string;
  password: string;
  role: Role;
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
  findAll(params: SearchUserParams): Promise<{ count: number; result: User[] }>;
}
