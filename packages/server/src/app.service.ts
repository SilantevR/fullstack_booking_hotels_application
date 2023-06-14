import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(user): string {
    return `Hello ${JSON.stringify(user)}!`;
  }
  getHelloAdmin(user): string {
    return `Hello admin ${JSON.stringify(user)}!`;
  }
  getHelloManager(user): string {
    return `Hello manager ${JSON.stringify(user)}!`;
  }
  getHelloClient(user): string {
    return `Hello client ${JSON.stringify(user)}!`;
  }
}
