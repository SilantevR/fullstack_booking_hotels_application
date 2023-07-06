import { User } from '../../users/interfaces/interfaces';

export interface ActiveUserData {
  sub: User['id'];
  email: User['email'];
  role: User['role'];
}
