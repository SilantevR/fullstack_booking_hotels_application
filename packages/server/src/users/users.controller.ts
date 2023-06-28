import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Res,
  Req,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { Auth } from './decorator/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Roles } from './decorator/roles.decorator';
import { Role } from './enums/role.enum';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Auth(AuthType.None)
  @Post('/client/register/')
  async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return {
        name: user.name,
        id: user.id,
        email: user.email,
      };
    } catch (err) {
      throw new ConflictException({
        status: err.response.status,
        description: err.response.description,
      });
    }
  }

  @Roles(Role.Admin)
  @Post('/admin/users/')
  async createByAdmin(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ) {
    try {
      const user = await this.usersService.create(createUserDto);
      return {
        name: user.name,
        id: user.id,
        email: user.email,
        role: user.role,
        phone: user.phone,
      };
    } catch (err) {
      throw new ConflictException({
        status: err.response.status,
        description: err.response.description,
      });
    }
  }

  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @Post('/auth/login/')
  async find(
    @Res({ passthrough: true }) response: Response,
    @Body(new ValidationPipe()) signInUserDto: SignInUserDto,
  ) {
    const { accessToken, refreshToken } = await this.usersService.find(
      signInUserDto,
    );
    response.cookie('accessToken', accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    response.cookie('refreshToken', refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    //return {accessToken, refreshToken};
  }

  @HttpCode(HttpStatus.OK)
  @Post('/auth/logout/')
  async logout(@Res() response: Response, @Req() request: Request) {
    console.log(request.cookies);
    response.clearCookie('accessToken', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    response.clearCookie('refreshToken', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/auth/refresh/')
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const { accessToken, refreshToken } = await this.usersService.refreshTokens(
      request.cookies['refreshToken'],
    );
    response.cookie('accessToken', accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    response.cookie('refreshToken', refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    //return {accessToken, refreshToken};
  }
}
