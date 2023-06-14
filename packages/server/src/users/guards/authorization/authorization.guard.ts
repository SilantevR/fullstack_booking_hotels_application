import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/users/enums/role.enum';
import { ROLES_KEY } from 'src/users/decorator/roles.decorator';
import { ActiveUserData } from 'src/users/interfaces/interfaces';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const contextRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )
    
    if(!contextRoles){
    return true;
    }
    const user: ActiveUserData = context.switchToHttp().getRequest()[process.env.REQUEST_USER_KEY]
    return contextRoles.some((role)=> user.role === role)
  }
}
