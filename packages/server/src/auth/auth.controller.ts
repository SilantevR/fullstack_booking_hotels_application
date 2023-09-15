import {
  Controller,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  Post,
  Body,
  ValidationPipe,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { AuthType } from './enums/auth-type.enum';
import { Auth } from './decorator/auth.decorator';
import { Response, Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @Post('/client/register/')
  async create(
    @Res({ passthrough: true }) response: Response,
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ) {
    const user = await this.usersService.create(createUserDto);
    const { accessToken, refreshToken } = await this.authService.generateTokens(
      user,
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

    return {
      name: user.name,
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @Post('/auth/login/')
  async find(
    @Res({ passthrough: true }) response: Response,
    @Body(new ValidationPipe()) signInUserDto: SignInUserDto,
  ) {
    const { tokens, user } = await this.authService.find(signInUserDto);

    response.cookie('accessToken', tokens.accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    response.cookie('refreshToken', tokens.refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    return {
      name: user.name,
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/auth/user')
  async findUserByToken(@Req() request: Request) {
    const user = await this.authService.findUserByToken(request.cookies);

    return {
      name: user.name,
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @Post('/auth/logout/')
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    response.clearCookie('accessToken', {
      path: '/',
      domain: 'localhost',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    response.clearCookie('refreshToken', {
      path: '/',
      domain: 'localhost',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return;
  }

  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @Post('/auth/refresh/')
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
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
    return;
  }
}
