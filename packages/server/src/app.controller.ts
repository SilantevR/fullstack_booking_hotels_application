import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ActiveUser } from './auth/decorator/active-user.decorator';
import { ActiveUserData } from './auth/interfaces/interfaces';
import { Roles } from './auth/decorator/roles.decorator';
import { Role } from './auth/enums/role.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@ActiveUser() user: ActiveUserData): string {
    return this.appService.getHello(user);
  }

  @Roles(Role.Admin)
  @Get('admin')
  getHelloAdmin(@ActiveUser() user: ActiveUserData): string {
    return this.appService.getHelloAdmin(user);
  }
  @Roles(Role.Admin)
  @Roles(Role.Manager)
  @Get('manager')
  getHelloManager(@ActiveUser() user: ActiveUserData): string {
    return this.appService.getHelloManager(user);
  }
  @Roles(Role.Admin)
  @Roles(Role.Client)
  @Get('client')
  getHelloClient(@ActiveUser() user: ActiveUserData): string {
    return this.appService.getHelloManager(user);
  }
}
